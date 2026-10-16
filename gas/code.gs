/** GalleryPass — Google Apps Script web app backend.
 * Demo-only shared spreadsheet storage. Deploy as a Web app and use access controls.
 * Do not put real client data in this demo deployment.
 */
const APP_TITLE = 'GalleryPass';
const DATA_SHEET = 'Appointments';
const HEADERS = ['id','name','phone','email','date','time','guests','host','venue','purpose','notes','status','createdAt'];
const DEMO_RECORDS = [
 {id:'GP-261015-1042',name:'Aarav Sharma',phone:'9876543210',email:'aarav@example.com',date:'2026-10-16',time:'10:30',guests:2,host:'Priya Mehta',venue:'Experience Gallery · Reception A',purpose:'Property walkthrough',notes:'Family visit',status:'Booked',createdAt:'2026-10-15T09:00:00.000Z'},
 {id:'GP-261015-1043',name:'Ananya Deshmukh',phone:'9876543211',email:'ananya@example.com',date:'2026-10-16',time:'11:00',guests:3,host:'Rahul Kulkarni',venue:'Experience Gallery · Reception A',purpose:'Project consultation',notes:'Returning client',status:'Arrived',createdAt:'2026-10-15T09:10:00.000Z'},
 {id:'GP-261015-1044',name:'Rohan Patil',phone:'9876543212',email:'rohan@example.com',date:'2026-10-16',time:'12:00',guests:1,host:'Sneha Shah',venue:'Experience Gallery · Reception B',purpose:'First visit',notes:'',status:'Booked',createdAt:'2026-10-15T09:20:00.000Z'},
 {id:'GP-261015-1045',name:'Meera Joshi',phone:'9876543213',email:'meera@example.com',date:'2026-10-16',time:'14:30',guests:2,host:'Amit Rao',venue:'Experience Gallery · Reception B',purpose:'Follow-up appointment',notes:'',status:'Booked',createdAt:'2026-10-15T09:30:00.000Z'}
];

function doGet() {
  return HtmlService.createHtmlOutputFromFile('index')
    .setTitle(APP_TITLE + ' — Appointment & Arrival Desk')
    .addMetaTag('viewport', 'width=device-width, initial-scale=1');
}

function getRecords() {
  const sheet = getDataSheet_();
  const lastRow = sheet.getLastRow();
  if (lastRow < 2) {
    saveRecords(DEMO_RECORDS);
    return DEMO_RECORDS;
  }
  const rows = sheet.getRange(2, 1, lastRow - 1, HEADERS.length).getValues();
  return rows.filter(row => row[0]).map(row => {
    const item = {};
    HEADERS.forEach((key, i) => item[key] = row[i] instanceof Date
      ? Utilities.formatDate(row[i], Session.getScriptTimeZone(), 'yyyy-MM-dd')
      : row[i]);
    item.guests = Number(item.guests) || 1;
    return item;
  });
}

/** Replaces the demo appointment table atomically under a script lock. */
function saveRecords(records) {
  if (!Array.isArray(records)) throw new Error('Invalid appointment payload.');
  if (records.length > 5000) throw new Error('Demo limit is 5,000 appointments.');
  const clean = records.map(r => {
    const o = {};
    HEADERS.forEach(key => {
      let value = r && r[key] != null ? r[key] : '';
      if (typeof value === 'object') value = '';
      value = String(value);
      // Prevent spreadsheet formula injection in user-entered text.
      if (/^[=+@]/.test(value)) value = "'" + value;
      o[key] = value;
    });
    o.guests = Math.max(1, Number(r.guests) || 1);
    return o;
  });
  const lock = LockService.getScriptLock();
  lock.waitLock(15000);
  try {
    const sheet = getDataSheet_();
    sheet.clearContents();
    sheet.getRange(1, 1, 1, HEADERS.length).setValues([HEADERS]);
    if (clean.length) {
      sheet.getRange(2, 1, clean.length, HEADERS.length)
        .setValues(clean.map(o => HEADERS.map(k => o[k])));
    }
    sheet.setFrozenRows(1);
    sheet.getRange(1, 1, 1, HEADERS.length).setFontWeight('bold');
    return {ok: true, count: clean.length};
  } finally {
    lock.releaseLock();
  }
}

function getDataSheet_() {
  const props = PropertiesService.getScriptProperties();
  let id = props.getProperty('GALLERYPASS_SPREADSHEET_ID');
  let ss;
  if (id) {
    try { ss = SpreadsheetApp.openById(id); } catch (e) { ss = null; }
  }
  if (!ss) {
    ss = SpreadsheetApp.create('GalleryPass Demo Appointments');
    props.setProperty('GALLERYPASS_SPREADSHEET_ID', ss.getId());
  }
  let sheet = ss.getSheetByName(DATA_SHEET);
  if (!sheet) sheet = ss.insertSheet(DATA_SHEET);
  if (sheet.getLastRow() === 0) sheet.getRange(1, 1, 1, HEADERS.length).setValues([HEADERS]);
  return sheet;
}

/** Run manually once to locate the demo spreadsheet in the execution log. */
function logDataSpreadsheetUrl() {
  Logger.log(getDataSheet_().getParent().getUrl());
}
