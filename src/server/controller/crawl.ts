import axios from 'axios'
import * as fs from 'fs'
import * as dayjs from 'dayjs'
import * as del from 'del'
import * as archiver from 'archiver'

interface Param {
  begin_date: string,
  end_date: string,
  csz: number
}

export default async function getChinabondFile (param: Param) {
  if (!checkParam(param)) throw Error('参数错误')

  const dates = getDownloadDates(param.begin_date, param.end_date)
  await cleanDownloadDir()
  await getFiles(dates, param.csz)
  await archiveFiles()
  console.log('finished')

  return fs.createReadStream('./download.zip')
}

function checkParam(param: Param) {
  const { begin_date, end_date, csz } = param
  let valid = true
  if (
    (!begin_date || !end_date || !csz) ||
    (begin_date > end_date)
  ) {
    valid = false
  }

  return valid
}

function getDownloadDates(begin: string, end: string) {
  if (begin > end) return []

  const beginDateObj = new Date(begin)
  const endDateObj = new Date(end)

  if (isNaN(beginDateObj.getTime()) || isNaN(endDateObj.getTime())) throw Error('时间格式不正确')

  const dates = []
  const currentDate = beginDateObj
  while (currentDate <= endDateObj) {
    dates.push(dayjs(currentDate).format('YYYY-MM-DD'))
    currentDate.setDate(currentDate.getDate() + 1)
  }

  return dates
}

async function cleanDownloadDir () {
  await del('./download/*')
}

async function getFiles (dates:string[], csz:number = 1) {
  while (dates.length) {
    await Promise.all(dates.slice(0, 5).map(date => getFile(date, csz)))
    dates = dates.slice(5)
  }
}

async function getFile (date:string, csz:number) {
  console.log('fetching...', date)
  const filename = `${date}-${csz}.xlsx`
  const path = `./data/${filename}`
  const copyPath = `./download/${filename}`
  if (checkFileExist(path)) {
    console.log(path, ' already exists')
    return copyFile(path, copyPath)
  }
  const data = await axios({
    url: `http://yield.chinabond.com.cn/cbweb-mn/yc/bxjDownload?gzr=${date}&csz=${csz}&locale=zh_CN`,
    method: 'post',
    responseType: 'stream'
  })
  return new Promise(async resolve => {
    data.data.pipe(fs.createWriteStream(path))
    await copyFile(path, copyPath)
    console.log(date, ' download success')
    resolve()
  })
}

function checkFileExist (filename:string) {
  return fs.existsSync(filename)
}

function copyFile (source:string, target:string) {
  return new Promise((resolve, reject) => {
    fs.copyFile(source, target, (err:Error) => {
      if (err) reject(err)
      resolve()
    }
  )})
}

async function archiveFiles () {
  await del('./download.zip')
  return new Promise(resolve => {
    const output = fs.createWriteStream('./download.zip')
    const archive = archiver('zip', {
      zlib: { level: 9 }
    })
    output.on('close', () => {
      console.log(archive.pointer() + ' total bytes')
      console.log('archiver has been finalized and the output file descriptor has closed')
      resolve()
    })
    output.on('end', () => {
      console.log('data has been drained')
    })
    archive.on('warning', err => {
      if (err.code === 'ENOENT') {
        console.error(err)
      } else {
        throw err
      }
    })
    archive.on('error', err => { throw err })
    archive.pipe(output)
    archive.directory('./download/', 'download')
    archive.finalize()
  })
}