import { useState, useEffect, useCallback } from "react";

// ─────────────────────────────────────────────
// JIEQI DATA  (solar term UTC boundaries)
// ─────────────────────────────────────────────
const JIEQI = {
  1960:[[1,6,11,1],[2,5,5,57],[3,6,13,5],[4,5,8,32],[5,6,0,19],[6,6,3,15],[7,7,12,38],[8,7,13,27],[9,8,9,50],[10,8,18,16],[11,7,21,20],[12,7,12,41]],
  1961:[[1,5,16,23],[2,3,11,17],[3,6,18,44],[4,5,14,47],[5,6,5,50],[6,6,9,30],[7,7,18,24],[8,7,19,18],[9,8,15,45],[10,8,23,16],[11,8,2,8],[12,7,17,8]],
  1962:[[1,5,22,18],[2,3,17,17],[3,6,0,30],[4,5,20,22],[5,6,11,57],[6,6,15,19],[7,7,23,52],[8,8,1,7],[9,8,21,17],[10,9,4,55],[11,8,8,2],[12,7,22,55]],
  1963:[[1,6,4,9],[2,3,23,9],[3,6,6,8],[4,5,2,4],[5,5,17,59],[6,5,21,4],[7,7,5,20],[8,7,6,10],[9,8,3,24],[10,8,10,44],[11,7,13,17],[12,7,4,4]],
  1964:[[1,6,9,39],[2,4,4,57],[3,5,11,35],[4,4,8,27],[5,5,0,28],[6,5,3,56],[7,6,14,5],[8,6,16,48],[9,7,13,17],[10,8,2,17],[11,7,5,19],[12,6,20,21]],
  1965:[[1,5,15,27],[2,3,11,46],[3,5,17,5],[4,4,13,46],[5,5,6,15],[6,5,9,56],[7,6,19,47],[8,6,22,42],[9,7,18,33],[10,8,3,39],[11,7,6,29],[12,7,1,43]],
  1966:[[1,5,21,19],[2,3,17,37],[3,5,22,53],[4,4,19,8],[5,5,11,49],[6,5,14,34],[7,7,1,23],[8,7,4,18],[9,8,0,18],[10,8,9,8],[11,7,12,14],[12,7,3,7]],
  1967:[[1,6,3,9],[2,3,23,22],[3,6,5,37],[4,5,0,55],[5,5,17,19],[6,5,21,14],[7,7,6,40],[8,7,9,16],[9,8,6,13],[10,8,13,44],[11,7,17,6],[12,7,8,16]],
  1968:[[1,6,8,29],[2,4,5,8],[3,5,11,22],[4,4,7,40],[5,4,22,49],[6,5,2,14],[7,6,12,48],[8,6,14,58],[9,7,11,26],[10,8,0,31],[11,7,3,30],[12,6,18,15]],
  1969:[[1,5,14,0],[2,3,10,55],[3,5,17,8],[4,4,13,16],[5,5,5,50],[6,5,8,55],[7,6,18,26],[8,6,21,8],[9,7,17,7],[10,8,1,42],[11,7,4,52],[12,6,23,28]],
  1970:[[1,5,19,57],[2,3,16,46],[3,5,22,56],[4,4,18,57],[5,5,11,14],[6,5,14,43],[7,7,0,36],[8,7,2,43],[9,7,23,59],[10,8,8,20],[11,7,10,50],[12,7,5,35]],
  1971:[[1,6,1,12],[2,3,22,26],[3,6,4,24],[4,5,0,54],[5,5,17,16],[6,5,20,20],[7,7,6,15],[8,7,7,46],[9,8,4,46],[10,8,13,3],[11,7,16,14],[12,7,6,58]],
  1972:[[1,6,7,14],[2,4,4,11],[3,5,10,21],[4,4,6,37],[5,4,23,0],[6,5,2,5],[7,6,12,4],[8,6,14,3],[9,7,10,47],[10,7,23,41],[11,7,2,23],[12,6,17,8]],
  1973:[[1,5,12,49],[2,3,9,37],[3,5,15,56],[4,4,12,31],[5,5,5,10],[6,5,8,1],[7,6,17,34],[8,6,19,53],[9,7,16,35],[10,8,1,0],[11,7,4,0],[12,6,22,39]],
  1974:[[1,5,18,45],[2,3,15,59],[3,5,21,46],[4,4,17,19],[5,5,10,38],[6,5,13,37],[7,6,23,28],[8,7,1,6],[9,7,21,55],[10,8,6,40],[11,7,9,11],[12,7,3,56]],
  1975:[[1,6,0,36],[2,3,21,50],[3,6,3,57],[4,4,23,19],[5,5,16,23],[6,5,19,26],[7,7,5,24],[8,7,7,27],[9,8,3,31],[10,8,12,1],[11,7,14,51],[12,7,6,6]],
  1976:[[1,6,6,15],[2,4,3,40],[3,5,9,50],[4,4,5,21],[5,4,21,24],[6,5,1,24],[7,6,11,19],[8,6,13,18],[9,7,9,49],[10,7,23,34],[11,7,2,9],[12,6,17,35]],
  1977:[[1,5,12,0],[2,3,8,31],[3,5,15,43],[4,4,11,57],[5,5,4,49],[6,5,7,14],[7,6,17,3],[8,6,18,25],[9,7,15,29],[10,8,0,1],[11,7,3,33],[12,6,22,21]],
  1978:[[1,5,17,27],[2,3,14,27],[3,5,21,25],[4,4,17,42],[5,5,10,9],[6,5,13,10],[7,6,22,55],[8,7,0,13],[9,7,21,1],[10,8,5,25],[11,7,8,10],[12,7,3,7]],
  1979:[[1,5,23,9],[2,3,20,13],[3,6,3,22],[4,4,23,35],[5,5,15,52],[6,5,19,2],[7,7,4,49],[8,7,5,48],[9,8,2,40],[10,8,10,48],[11,7,13,43],[12,7,8,43]],
  1980:[[1,6,4,49],[2,4,1,48],[3,5,9,10],[4,4,4,22],[5,4,21,42],[6,5,0,47],[7,6,10,42],[8,6,12,9],[9,7,9,0],[10,7,22,14],[11,7,1,14],[12,6,16,21]],
  1981:[[1,5,10,36],[2,3,7,31],[3,5,14,3],[4,4,10,3],[5,5,2,40],[6,5,6,44],[7,6,16,24],[8,6,17,56],[9,7,14,51],[10,8,3,19],[11,7,6,36],[12,6,21,51]],
  1982:[[1,5,16,19],[2,3,13,31],[3,5,19,55],[4,4,15,58],[5,5,8,23],[6,5,11,24],[7,6,21,24],[8,6,23,18],[9,7,20,46],[10,8,4,18],[11,7,7,22],[12,7,3,10]],
  1983:[[1,5,22,8],[2,3,19,31],[3,6,1,39],[4,4,21,40],[5,5,14,6],[6,5,17,9],[7,7,3,4],[8,7,4,8],[9,8,2,7],[10,8,10,28],[11,7,12,37],[12,7,8,46]],
  1984:[[1,6,3,57],[2,4,1,19],[3,5,7,24],[4,4,3,38],[5,4,19,58],[6,4,23,52],[7,6,9,57],[8,6,11,34],[9,7,7,36],[10,7,16,46],[11,6,18,11],[12,6,13,29]],
  1985:[[1,5,9,58],[2,3,6,41],[3,5,13,14],[4,4,9,26],[5,5,2,3],[6,5,5,12],[7,6,15,6],[8,6,16,36],[9,7,13,42],[10,8,1,25],[11,7,5,24],[12,6,20,7]],
  1986:[[1,5,15,46],[2,3,12,43],[3,5,19,3],[4,4,15,12],[5,5,7,27],[6,5,11,30],[7,6,21,25],[8,6,22,52],[9,7,19,0],[10,8,6,36],[11,7,10,45],[12,7,2,3]],
  1987:[[1,5,21,41],[2,3,18,52],[3,6,0,52],[4,4,20,57],[5,5,13,9],[6,5,17,11],[7,7,3,5],[8,7,4,9],[9,8,1,9],[10,8,12,28],[11,7,16,29],[12,7,7,46]],
  1988:[[1,6,3,27],[2,4,0,34],[3,5,6,39],[4,4,2,9],[5,4,19,3],[6,5,2,34],[7,6,8,54],[8,6,10,14],[9,7,6,29],[10,7,18,48],[11,6,21,12],[12,6,12,28]],
  1989:[[1,5,9,7],[2,3,5,20],[3,5,12,28],[4,4,7,39],[5,5,0,22],[6,5,4,53],[7,6,14,6],[8,6,15,46],[9,7,12,20],[10,8,0,35],[11,7,3,21],[12,6,17,22]],
  1990:[[1,5,15,17],[2,3,11,14],[3,5,18,19],[4,4,13,27],[5,5,5,44],[6,5,10,33],[7,6,19,39],[8,6,21,0],[9,7,17,48],[10,8,6,11],[11,7,9,14],[12,6,23,7]],
  1991:[[1,5,21,8],[2,3,17,8],[2,3,17,8],[4,4,19,9],[5,5,11,22],[6,5,15,2],[7,7,1,5],[8,7,2,53],[9,7,23,49],[10,8,7,51],[11,7,11,36],[12,7,5,8]],
  1992:[[1,6,2,48],[2,3,22,43],[3,5,5,12],[4,4,1,3],[5,4,17,12],[6,5,0,14],[7,6,10,8],[8,6,12,10],[9,7,8,34],[10,7,17,13],[11,6,20,27],[12,6,11,44]],
  1993:[[1,5,8,4],[2,3,4,34],[3,5,11,41],[4,4,7,49],[5,5,0,57],[6,5,5,0],[7,6,15,55],[8,6,17,50],[9,7,14,22],[10,7,22,37],[11,7,2,3],[12,6,16,26]],
  1994:[[1,5,14,24],[2,3,10,31],[3,5,17,31],[4,4,13,36],[5,5,6,32],[6,5,10,48],[7,6,20,41],[8,6,22,43],[9,7,19,20],[10,8,4,4],[11,7,7,4],[12,6,22,23]],
  1995:[[1,5,20,13],[2,3,16,13],[3,5,22,14],[4,4,18,22],[5,5,11,21],[6,5,15,34],[7,7,2,8],[8,7,4,14],[9,8,0,13],[10,8,8,31],[11,7,12,0],[12,7,3,18]],
  1996:[[1,6,1,53],[2,3,21,52],[3,5,4,4],[4,4,0,4],[5,4,17,19],[6,4,20,23],[7,6,7,19],[8,6,9,23],[9,7,5,0],[10,7,13,37],[11,6,17,19],[12,6,8,56]],
  1997:[[1,5,7,43],[2,3,3,43],[3,5,9,43],[4,4,5,3],[5,4,22,18],[6,5,2,20],[7,6,12,15],[8,6,14,19],[9,7,10,30],[10,7,19,16],[11,6,22,52],[12,6,14,7]],
  1998:[[1,5,13,46],[2,3,9,55],[3,5,15,55],[4,4,10,55],[5,5,3,55],[6,5,7,3],[7,6,16,55],[8,6,19,1],[9,7,16,1],[10,8,0,10],[11,7,4,10],[12,6,20,1]],
  1999:[[1,5,19,38],[2,3,15,47],[3,5,21,46],[4,4,17,46],[5,5,9,22],[6,5,13,22],[7,6,22,51],[8,7,0,12],[9,7,21,27],[10,8,5,51],[11,7,9,7],[12,7,0,21]],
  2000:[[1,6,17,17],[2,4,13,3],[3,5,20,35],[4,4,17,15],[5,5,10,1],[6,5,14,1],[7,7,0,19],[8,7,1,46],[9,7,22,49],[10,8,7,8],[11,7,10,1],[12,7,1,32]],
  2001:[[1,5,23,17],[2,3,18,52],[3,5,2,31],[4,4,22,52],[5,5,15,45],[6,5,19,53],[7,7,6,7],[8,7,7,53],[9,8,4,54],[10,8,12,57],[11,7,15,53],[12,7,7,11]],
  2002:[[1,6,5,9],[2,4,0,43],[3,6,8,16],[4,5,4,55],[5,6,21,31],[6,6,1,44],[7,7,11,55],[8,7,13,55],[9,8,10,55],[10,8,18,55],[11,7,21,55],[12,7,13,4]],
  2003:[[1,6,11,8],[2,4,6,35],[3,6,14,0],[4,5,10,52],[5,6,3,11],[6,6,7,12],[7,7,17,35],[8,7,19,8],[9,8,16,7],[10,9,0,8],[11,8,3,1],[12,7,18,14]],
  2004:[[1,6,17,7],[2,4,12,56],[3,5,19,48],[4,4,16,43],[5,5,8,52],[6,5,12,26],[7,6,22,33],[8,7,1,20],[9,7,22,14],[10,8,6,49],[11,7,9,59],[12,7,0,52]],
  2005:[[1,5,22,52],[2,3,18,43],[3,5,1,34],[4,4,22,37],[5,5,14,54],[6,5,18,47],[7,7,4,42],[8,7,7,3],[9,8,4,4],[10,8,12,7],[11,7,14,58],[12,7,6,12]],
  2006:[[1,6,5,18],[2,4,0,27],[3,6,7,17],[4,5,4,15],[5,5,20,31],[6,6,0,26],[7,7,10,18],[8,7,12,19],[9,8,9,14],[10,8,17,15],[11,7,20,58],[12,7,11,9]],
  2007:[[1,6,10,41],[2,4,6,18],[3,6,12,49],[4,5,9,32],[5,6,2,4],[6,6,6,11],[7,7,16,0],[8,7,17,31],[9,8,14,29],[10,8,22,25],[11,8,1,24],[12,7,17,32]],
  2008:[[1,6,16,23],[2,4,12,0],[3,5,18,48],[4,4,15,34],[5,5,7,59],[6,5,11,35],[7,6,21,54],[8,7,0,3],[9,7,20,45],[10,8,4,44],[11,7,7,37],[12,6,22,38]],
  2009:[[1,5,22,9],[2,3,17,51],[3,5,1,15],[4,4,21,56],[5,5,14,51],[6,5,17,50],[7,7,4,2],[8,7,6,1],[9,8,2,47],[10,8,10,57],[11,7,13,22],[12,7,5,8]],
  2010:[[1,6,4,9],[2,3,23,47],[3,6,6,32],[4,5,3,30],[5,5,20,25],[6,5,23,49],[7,7,9,34],[8,7,11,48],[9,8,8,47],[10,8,16,27],[11,7,19,14],[12,7,10,38]],
  2011:[[1,6,9,32],[2,4,5,32],[3,6,12,21],[4,5,8,17],[5,6,1,7],[6,6,5,27],[7,7,15,0],[8,7,17,20],[9,8,14,12],[10,8,21,45],[11,8,0,35],[12,7,15,29]],
  2012:[[1,6,15,23],[2,4,10,22],[3,5,18,14],[4,4,14,12],[5,5,6,21],[6,5,10,37],[7,6,20,41],[8,6,22,31],[9,7,19,30],[10,8,3,12],[11,7,6,22],[12,6,21,12]],
  2013:[[1,5,21,19],[2,3,16,13],[3,5,23,1],[4,4,20,2],[5,5,12,18],[6,5,16,56],[7,7,2,35],[8,7,5,20],[9,8,1,2],[10,8,9,6],[11,7,12,14],[12,7,2,14]],
  2014:[[1,6,3,22],[2,3,22,0],[3,6,4,57],[4,5,1,47],[5,5,18,59],[6,5,21,51],[7,7,8,41],[8,7,10,2],[9,8,7,1],[10,8,15,0],[11,7,17,47],[12,7,8,4]],
  2015:[[1,6,8,20],[2,4,3,58],[3,6,10,36],[4,5,6,39],[5,6,0,3],[6,6,3,58],[7,7,13,51],[8,7,15,30],[9,8,12,21],[10,8,20,22],[11,7,23,0],[12,7,13,13]],
  2016:[[1,6,14,8],[2,4,9,46],[3,5,16,30],[4,4,12,27],[5,5,5,42],[6,5,9,48],[7,6,19,3],[8,6,21,53],[9,7,18,52],[10,8,1,33],[11,7,4,47],[12,6,18,54]],
  2017:[[1,5,20,24],[2,3,15,34],[3,5,22,29],[4,4,18,18],[5,5,10,31],[6,5,15,37],[7,7,1,18],[8,7,3,40],[9,8,0,29],[10,8,7,22],[11,7,10,38],[12,7,0,33]],
  2018:[[1,6,1,39],[2,3,21,28],[3,6,4,13],[4,5,0,13],[5,5,16,25],[6,5,21,29],[7,7,7,42],[8,7,9,30],[9,8,6,30],[10,8,13,15],[11,7,16,32],[12,7,6,23]],
  2019:[[1,6,6,39],[2,4,3,14],[3,6,10,0],[4,5,5,55],[5,5,22,3],[6,6,3,6],[7,7,13,17],[8,7,15,13],[9,8,11,17],[10,8,18,22],[11,7,22,25],[12,7,12,6]],
  2020:[[1,6,12,30],[2,4,8,3],[3,5,16,57],[4,4,10,38],[5,5,4,1],[6,5,9,1],[7,6,18,14],[8,6,21,8],[9,7,17,0],[10,8,0,55],[11,7,2,14],[12,6,17,9]],
  2021:[[1,5,17,23],[2,3,14,0],[3,5,22,54],[4,4,16,34],[5,5,9,47],[6,5,14,52],[7,7,0,18],[8,7,2,43],[9,7,23,53],[10,8,6,39],[11,7,8,36],[12,7,2,57]],
  2022:[[1,5,23,14],[2,4,20,51],[3,6,4,38],[4,5,2,20],[5,5,15,26],[6,6,20,25],[7,7,5,38],[8,7,8,29],[9,8,5,32],[10,8,12,22],[11,7,14,46],[12,7,5,46]],
  2023:[[1,5,5,4],[2,4,2,43],[3,6,10,24],[4,5,4,12],[5,6,21,18],[6,6,2,18],[7,7,11,31],[8,7,14,23],[9,8,11,27],[10,8,18,10],[11,7,20,36],[12,7,11,33]],
  2024:[[1,6,11,49],[2,4,8,26],[3,5,16,6],[4,4,10,0],[5,5,3,10],[6,5,8,10],[7,6,17,20],[8,6,20,9],[9,7,17,11],[10,8,0,0],[11,7,2,19],[12,6,17,17]],
  2025:[[1,5,17,32],[2,3,14,10],[3,5,21,1],[4,4,15,48],[5,5,8,55],[6,5,14,56],[7,6,23,29],[8,7,2,51],[9,7,22,52],[10,8,5,41],[11,7,8,4],[12,6,22,3]],
  2026:[[1,5,22,54],[2,3,19,51],[3,6,3,48],[4,4,21,39],[5,5,14,56],[6,5,20,42],[7,7,5,22],[8,7,8,13],[9,8,5,0],[10,8,11,46],[11,7,14,48],[12,7,4,37]],
};

const STEMS      = ['甲','乙','丙','丁','戊','己','庚','辛','壬','癸'];
const STEM_KOR   = ['갑','을','병','정','무','기','경','신','임','계'];   // Korean pronunciation
const STEM_ROM   = ['Gab','Eul','Byeong','Jeong','Mu','Gi','Gyeong','Sin','Im','Gye']; // Korean romanization
const STEM_EL    = ['Wood','Wood','Fire','Fire','Earth','Earth','Metal','Metal','Water','Water'];
const STEM_EL_KOR= ['목','목','화','화','토','토','금','금','수','수'];
const STEM_POL   = ['Yang','Yin','Yang','Yin','Yang','Yin','Yang','Yin','Yang','Yin'];
const STEM_POL_KOR=['양','음','양','음','양','음','양','음','양','음'];
const BRANCHES   = ['子','丑','寅','卯','辰','巳','午','未','申','酉','戌','亥'];
const BRANCH_KOR = ['자','축','인','묘','진','사','오','미','신','유','술','해'];  // Korean pronunciation
const BRANCH_ROM = ['Ja','Chuk','In','Myo','Jin','Sa','O','Mi','Sin','Yu','Sul','Hae'];
const BRANCH_EL  = ['Water','Earth','Wood','Wood','Earth','Fire','Fire','Earth','Metal','Metal','Earth','Water'];
const BRANCH_EL_KOR=['수','토','목','목','토','화','화','토','금','금','토','수'];
const BRANCH_POL = ['Yang','Yin','Yang','Yin','Yang','Yin','Yang','Yin','Yang','Yin','Yang','Yin'];
const EL_COLOR   = { Wood:'#7a9e6e', Fire:'#c06030', Earth:'#a88840', Metal:'#8896a0', Water:'#5080a0' };

// ─────────────────────────────────────────────
// CALCULATION ENGINE
// ─────────────────────────────────────────────
function toUTC(y, m, d, h, mi, tz) {
  try {
    const fmt = new Intl.DateTimeFormat('en-US', {
      timeZone: tz, year:'numeric', month:'2-digit', day:'2-digit',
      hour:'2-digit', minute:'2-digit', second:'2-digit', hour12: false
    });
    let lo = Date.UTC(y,m-1,d,h,mi) - 14*3600000;
    let hi = lo + 28*3600000;
    for (let i = 0; i < 36; i++) {
      const mid = Math.floor((lo+hi)/2);
      const p = {}; fmt.formatToParts(new Date(mid)).forEach(x => p[x.type] = parseInt(x.value)||0);
      const hh = p.hour === 24 ? 0 : p.hour;
      const cmp = Date.UTC(p.year, p.month-1, p.day, hh, p.minute);
      const tgt = Date.UTC(y, m-1, d, h, mi);
      if (cmp < tgt) lo = mid; else if (cmp > tgt) hi = mid; else { lo = hi = mid; break; }
    }
    return Math.floor((lo+hi)/2);
  } catch {
    const OFF = { 'Asia/Seoul':9,'Asia/Tokyo':9,'Asia/Shanghai':8,'Asia/Hong_Kong':8,
      'Asia/Singapore':8,'Asia/Bangkok':7,'Asia/Kolkata':5.5,'Asia/Dubai':4,
      'Europe/London':0,'Europe/Paris':1,'Europe/Berlin':1,'Europe/Moscow':3,
      'America/New_York':-5,'America/Chicago':-6,'America/Denver':-7,
      'America/Los_Angeles':-8,'America/Phoenix':-7,'Pacific/Honolulu':-10,
      'America/Anchorage':-9,'UTC':0 };
    return Date.UTC(y, m-1, d, h - (OFF[tz]||0), mi);
  }
}

function jq(yr, idx) {
  const d = JIEQI[yr]; if (!d || !d[idx]) return null;
  const [mo,day,h,mi] = d[idx]; return Date.UTC(yr, mo-1, day, h, mi);
}

function calcBazi(yr, mo, dy, hr, mi, tz, noTime) {
  const utc = toUTC(yr, mo, dy, hr ?? 12, mi ?? 0, tz);
  const uyr  = new Date(utc).getUTCFullYear();

  // Year pillar
  const lb  = jq(uyr, 1);
  const byr = utc < lb ? uyr - 1 : uyr;
  const ySI = (((byr - 1984) % 10) + 10) % 10;
  const yBI = (((byr - 1984) % 12) + 12) % 12;

  // Month pillar
  const steps = [{i:1,b:2},{i:2,b:3},{i:3,b:4},{i:4,b:5},{i:5,b:6},{i:6,b:7},{i:7,b:8},{i:8,b:9},{i:9,b:10},{i:10,b:11},{i:11,b:0}];
  let mBI = 1, sol = 11;
  const xh = jq(uyr, 0);
  if (utc >= xh) {
    for (const s of steps) {
      const t = jq(uyr, s.i); if (utc >= t) { mBI = s.b; sol = steps.indexOf(s); } else break;
    }
  } else { mBI = 0; sol = 10; }
  const yinBase = [2,4,6,8,0,2,4,6,8,0];
  const mSI = (yinBase[ySI] + sol) % 10;

  // Day pillar
  const pos = ((20 + Math.floor(utc/86400000 + 2440587.5 - 2451545)) % 60 + 60) % 60;
  const dSI = pos % 10, dBI = pos % 12;

  // Hour pillar
  let hSI = null, hBI = null;
  if (!noTime && hr != null) {
    const hb = hr===23?0:hr<1?0:hr<3?1:hr<5?2:hr<7?3:hr<9?4:hr<11?5:hr<13?6:hr<15?7:hr<17?8:hr<19?9:hr<21?10:11;
    hBI = hb; hSI = ([0,2,4,6,8,0,2,4,6,8][dSI] + hb) % 10;
  }

  const pillars = {
    year:  { s: ySI, b: yBI },
    month: { s: mSI, b: mBI },
    day:   { s: dSI, b: dBI },
    hour:  hSI != null ? { s: hSI, b: hBI } : null,
  };

  const ec = { Wood:0, Fire:0, Earth:0, Metal:0, Water:0 };
  const list = [pillars.year, pillars.month, pillars.day, ...(pillars.hour ? [pillars.hour] : [])];
  for (const p of list) {
    ec[STEM_EL[p.s]] += 1.5;
    ec[BRANCH_EL[p.b]] += 1;
  }
  const tot = Object.values(ec).reduce((a,b) => a+b, 0);
  const dmEl  = STEM_EL[dSI], dmPol = STEM_POL[dSI];
  const prod  = { Wood:'Water', Fire:'Wood', Earth:'Fire', Metal:'Earth', Water:'Metal' };
  const strong = (ec[prod[dmEl]] + ec[dmEl]) / tot > 0.38;

  return { pillars, dm: { si:dSI, el:dmEl, pol:dmPol, name:STEM_ROM[dSI], kor:STEM_KOR[dSI], char:STEMS[dSI] }, ec, tot, strong, monthBranch: mBI, birthUTC: utc, birthYear: new Date(utc).getUTCFullYear(), jieqiSol: sol };
}

// ─────────────────────────────────────────────
// ARCHETYPES
// ─────────────────────────────────────────────
const ARCHETYPES = [
  {
    id: `builder`, label: `Builder`, emoji: `⚙️`,
    tagline: `You think in systems. Complexity calms you when you can organize it.`,
    desc: `You naturally construct frameworks, workflows, and structures. You feel most at home when there is a clear process to own, improve, or create from scratch. Others bring you chaos; you return order.`,
    roles: {
      entry: [
        { title:`Associate Product Manager (APM)`, path:`Apply to Google, Meta, LinkedIn APM programs. These are explicitly designed for new grads with no PM experience.`, why:`You hold the roadmap and constraints simultaneously — the exact cognitive load Builders are built for.` },
        { title:`Business / Operations Analyst`, path:`Target rotational programs at McKinsey, BCG, Deloitte, or ops teams at tech companies (Amazon OpEx, Uber Ops).`, why:`Process diagnosis and redesign is your native language. This is the entry-level version of your ceiling job.` },
        { title:`Software Engineer (New Grad)`, path:`Standard SWE new grad pipeline. Build a GitHub portfolio first — 2-3 real projects, not tutorials.`, why:`Translating requirements into working systems is the purest form of Builder work.` },
        { title:`Supply Chain / Logistics Analyst`, path:`Target Amazon, Target, P&G, or 3PL firms. Many have dedicated new-grad rotational programs.`, why:`End-to-end systems thinking applied to physical constraints — underrated Builder role.` },
      ],
      mid: [
        { title:`Product Manager`, path:`Move from APM after 2-3 years. Alternatively, PM-pivot from engineering via internal transfers.`, why:`At mid-level, you own the product system end-to-end. This is where Builders peak early.` },
        { title:`Technical Program Manager (TPM)`, path:`Common path from SWE or ops after 3-5 years. Strong at FAANG and defense/aerospace.`, why:`You coordinate complexity across teams without losing the thread — rare and highly paid.` },
        { title:`Strategy & Operations Manager`, path:`Common internal move from ops analyst at tech companies (Uber, DoorDash, Airbnb ops roles are well-known pipelines).`, why:`Designing the operating system of a business division.` },
      ],
      pivot: [
        { title:`Chief of Staff`, path:`Often reached after 6-10 years via ops or PM track. Best entry is internal — volunteer for cross-functional work.`, why:`The closest thing to "running everything" without the CEO title.` },
        { title:`Consultant → Operator`, path:`Leave consulting after 2-3 years to join a portfolio company or startup in an ops leadership role.`, why:`Builders who consult often find they want to own the implementation, not just the deck.` },
      ],
    },
    industries: [
      { name:`Big Tech (FAANG+)`, fit:5, note:`Structured systems, clear scope, comp is strong for Builders who ship.` },
      { name:`B2B SaaS`, fit:5, note:`Product complexity is high, iteration cycles are fast — Builders thrive here.` },
      { name:`Management Consulting`, fit:4, note:`Great for skill-building. Exit into ops leadership after 2-3 years.` },
      { name:`Defense / Aerospace`, fit:4, note:`High system complexity, long time horizons, strong job security.` },
      { name:`Supply Chain / Logistics`, fit:4, note:`Underrated for Builders — Amazon, FedEx, 3PLs need systematic thinkers badly.` },
      { name:`Finance (Quant / FinTech)`, fit:3, note:`Strong fit if you lean technical. Less fit if the culture is pure relationship-driven.` },
      { name:`Healthcare IT`, fit:3, note:`High complexity, regulation creates systems problems worth solving.` },
      { name:`Early-stage Startup`, fit:2, note:`Can work, but chaotic environments with no existing systems can frustrate Builders.` },
    ],
    seek: [
      `Roles with clear scope and measurable outcomes — ambiguity without structure drains you`,
      `Teams that document decisions and processes — your output compounds over time if it's written down`,
      `Problems that repeat — systems only pay off if they're used more than once`,
      `Managers who give you ownership of a whole system, not just tasks inside someone else's`,
    ],
    avoid: [
      `Roles where the goal or strategy changes every quarter — you invest in systems, not pivots`,
      `"We figure it out as we go" cultures — this isn't agility, it's chaos for you`,
      `Pure client-facing roles with no back-end process to own or improve`,
      `Creative-first environments where improvisation is the culture — you'll feel underused`,
    ],
    burnout: `You burn out by over-engineering — adding complexity to feel productive when the real move is to ship and iterate. If you've been in "planning mode" for more than a week, that's the signal.`,
    burnout_recovery: `Pick the smallest possible version of what you're building and finish it today. Completion resets the loop. Shipping something imperfect beats architecting something perfect.`,
    actions: [
      `Pick one broken process in your current life — coursework, job search pipeline, morning routine — and document it as if handing it to someone else. This is your instinct in practice.`,
      `Set up a public GitHub profile with one real project (not a tutorial clone). A simple tool that solves a problem you actually had. Builders are judged by what they've shipped, not what they've learned.`,
      `Find one person working in your top target role. LinkedIn > search job title + company. Send this: "Hi [name] — I'm a [student/career-changer] interested in [role]. I noticed [specific thing]. Would you be open to a 15-min call?"`,
    ],
    interview: `Lead with a system you built or improved — even a small one. "I redesigned how our team tracked project status and cut our weekly sync from 60 to 20 minutes" is a Builder story. Candidates who describe their process clearly win against more experienced candidates who can't.`,
    strategy: `Build a rough version before writing the analysis. Learning by making is your core strength.`,
    stress: `You over-engineer when anxious. When stuck, scope down by half and ship that first.`,
  },

  {
    id: `analyst`, label: `Analyst`, emoji: `🔍`,
    tagline: `You ask why before how. Root cause matters more to you than speed.`,
    desc: `Depth is your instinct. You are drawn to questions that others stop too early on, and you're most valuable where understanding the problem correctly is itself the work. Your best output is clarity — converting noise into signal that changes decisions.`,
    roles: {
      entry: [
        { title:`Business / Data Analyst`, path:`Target analyst programs at tech companies (Google BOLD, Meta Rotational), consulting firms, or finance. SQL + Python basics are the minimum bar.`, why:`Your native mode: turn raw data into decisions. Every company needs this badly.` },
        { title:`Research Analyst (equity / market)`, path:`Entry via investment banks (Goldman, JPMorgan), asset managers, or boutique research firms. CFA Level 1 helps but isn't required to apply.`, why:`Deep diligence on companies or sectors — pattern recognition across industries is your exact strength.` },
        { title:`Management Consulting Analyst`, path:`BCG, McKinsey, Bain hire new grads heavily. Case prep is a 200-300 hour investment before interviews. Firms like Deloitte, KPMG, Accenture have lower bars.`, why:`Getting paid to think rigorously about problems you didn't cause — structured Analyst work.` },
        { title:`UX Researcher`, path:`Entry via tech companies or agencies. Build a portfolio of 2-3 research projects (even self-initiated). Nielsen Norman certifications help signal credibility.`, why:`You find the real problem underneath the one users describe — that's root-cause Analyst thinking applied to human behavior.` },
      ],
      mid: [
        { title:`Senior Analyst / Analytics Manager`, path:`3-5 years → move into leading a team of analysts or owning a data domain.`, why:`Your analysis starts driving strategy, not just informing it.` },
        { title:`Strategy Manager`, path:`Common exit from consulting after 2-3 years, into corporate strategy roles at tech/healthcare/finance companies.`, why:`Applying Analyst rigor to long-horizon business decisions — the highest-leverage version of your skill.` },
        { title:`Investment Associate (VC/PE)`, path:`Usually requires 2 years in banking or consulting first. Target firms that hire directly from those tracks.`, why:`Contrarian thinking + deep diligence + pattern recognition — Analyst work at its highest stakes.` },
      ],
      pivot: [
        { title:`Head of Research / Insights`, path:`Senior Analyst track, usually 7-10 years in. The role exists at tech companies, media, and research firms.`, why:`You design the questions, not just answer them.` },
        { title:`Founder in data-driven industry`, path:`Some Analysts eventually build their own research product, newsletter, or data business.`, why:`When your analysis is good enough that people pay for it directly.` },
      ],
    },
    industries: [
      { name:`Investment Banking / PE / VC`, fit:5, note:`The most Analyst-intensive industry that exists. Comp is highest here.` },
      { name:`Management Consulting`, fit:5, note:`Structured rigor, diverse problems, fast skill accumulation.` },
      { name:`Big Tech (data/research teams)`, fit:5, note:`Google, Meta, Amazon all have large, well-resourced analytics orgs.` },
      { name:`Healthcare / Pharma (R&D, policy)`, fit:4, note:`High-stakes analysis where depth literally matters for outcomes.` },
      { name:`Government & Policy`, fit:4, note:`Long time horizons, complex systems, high tolerance for nuance.` },
      { name:`Media & Journalism (data)`, fit:3, note:`Data journalism, investigative research — niche but growing.` },
      { name:`Early-stage Startup`, fit:2, note:`Often too early for dedicated Analyst roles.` },
      { name:`Sales-led organizations`, fit:1, note:`Speed and relationships drive decisions here, not analysis. You'll feel chronically underheard.` },
    ],
    seek: [
      `Roles where the quality of your thinking — not just your output volume — is what's valued`,
      `Access to real, messy data and enough time to actually interpret it (not just pull it)`,
      `Managers who ask "why do you think that?" — not just "what's the number?"`,
      `Problems that require synthesis across multiple domains or data sources`,
    ],
    avoid: [
      `High-volume, low-depth work — you'll disengage fast and produce mediocre output`,
      `Roles where speed consistently beats accuracy (some trading floors, PR, real-time ops)`,
      `Teams that dismiss nuance as "analysis paralysis" — this is a cultural mismatch, not a personal flaw`,
      `Any role where your conclusions are systematically ignored or overridden by gut feel`,
    ],
    burnout: `You burn out by looping — researching past the point of diminishing returns, unable to commit because there's always one more variable to control for. The pattern: you're exhausted, but you feel like you haven't actually done anything. That's the signal.`,
    burnout_recovery: `Write your current best answer right now, in one paragraph, and commit to it for 48 hours before revising. The constraint forces a conclusion. Most of the time, your first conclusion was right.`,
    actions: [
      `Pick one topic you care about. Write a 400-word opinion piece with a clear thesis and exactly three supporting data points. Publish it — LinkedIn, Substack, anywhere. The constraint forces you out of research mode into conclusion mode.`,
      `Find a public dataset in your area of interest (Kaggle, data.gov, BLS, FRED). Run a basic analysis. Write up ONE insight in plain language — not the methodology, just what it means. Post that paragraph.`,
      `Practice the "so what" test out loud. After your next piece of analysis, explain it to someone non-technical in 60 seconds, ending with "...which means we should ___." If you can't finish that sentence, you're not done yet.`,
    ],
    interview: `Analysts lose offers by describing their process instead of their insight. Lead with the conclusion: "I found that customer churn was 80% driven by a single onboarding step — not pricing — and here's what we changed." The hiring manager is evaluating your judgment, not your methodology.`,
    strategy: `Set a decision deadline. Research is only useful until you need to act — then act.`,
    stress: `You loop under pressure. Time-box your research: 48 hours max, then commit with what you have.`,
  },

  {
    id: `connector`, label: `Connector`, emoji: `🌐`,
    tagline: `You think through talking. People are how you process the world.`,
    desc: `Your thinking sharpens through conversation and collaboration. You read a room instinctively, translate between different worldviews, and make complex things comprehensible. You're at your best when you're bridging — between teams, ideas, or people who wouldn't otherwise connect.`,
    roles: {
      entry: [
        { title:`Account Coordinator / Customer Success Associate`, path:`Target SaaS companies and agencies. HubSpot, Salesforce, and most B2B tech companies have dedicated CS new-grad programs.`, why:`Long-term relationships + real-time problem solving + human stakes — this is Connector work in practice.` },
        { title:`Recruiting Coordinator / HR Analyst`, path:`Entry via in-house talent teams or staffing agencies. Good path into broader People Operations or HRBP roles.`, why:`Your read on people and culture is unusually accurate — this is the entry door into a field where that's the entire skill.` },
        { title:`Marketing Coordinator / Content Associate`, path:`Target agencies, tech companies, or DTC brands. Build a portfolio of any writing or communication work you've done — even unpaid.`, why:`Translating ideas into language that lands for specific audiences — that's the core Connector skill applied to marketing.` },
        { title:`Program / Project Coordinator`, path:`Nonprofits, government agencies, and large companies all have these. AmeriCorps and City Year are strong pipelines into mission-driven coordination work.`, why:`You're most effective when connecting people and moving information — coordination is the purest form of that.` },
      ],
      mid: [
        { title:`Product Marketing Manager`, path:`2-3 years in marketing or CS → move into PMM. Strong at tech companies (Salesforce, Stripe, Figma all have robust PMM functions).`, why:`Translating technical product into human language — this is the highest-leverage Connector role in tech.` },
        { title:`HR Business Partner (HRBP)`, path:`3-5 years in HR/recruiting → HRBP role, which partners with business leaders on people strategy.`, why:`Your intuition about people + ability to navigate competing interests = this role.` },
        { title:`Enterprise Account Executive`, path:`Path from CS or SDR role. Consultative sales — not transactional — requires genuine relationship building over 3-12 month sales cycles.`, why:`Complex deals built on trust over time. Connectors close these; Builders often don't.` },
      ],
      pivot: [
        { title:`Head of Community / Partnerships`, path:`Senior Connector track — usually 6-10 years. Community-led companies (Figma, Notion, Duolingo) have built entire business strategies on this function.`, why:`You create trust at scale — a genuinely rare and defensible business skill.` },
        { title:`Educator / Course Creator`, path:`Connectors who develop domain expertise often find the most leverage in teaching. Platform options: Maven, Substack, YouTube, university roles.`, why:`You learn best by teaching, and you make others learn faster. These two facts compound.` },
      ],
    },
    industries: [
      { name:`SaaS / B2B Tech (CS, PMM)`, fit:5, note:`The Connector skill is most valued and most compensated in B2B tech.` },
      { name:`Education / EdTech`, fit:5, note:`Your teaching instinct finds the highest expression here.` },
      { name:`Consulting (change management, org design)`, fit:4, note:`The human side of transformation — getting organizations to actually change.` },
      { name:`Healthcare (patient-facing, care coordination)`, fit:4, note:`High human stakes + real relationship continuity — meaningful for Connectors.` },
      { name:`Non-profit / NGO`, fit:4, note:`Mission-driven, relationship-intensive, complex stakeholder navigation.` },
      { name:`Media & Communications`, fit:3, note:`Strong fit if you develop a specific domain expertise alongside your communication skills.` },
      { name:`Highly quantitative finance`, fit:1, note:`Deep solo analytical work, limited human interaction — a mismatch for most Connectors.` },
    ],
    seek: [
      `Roles with real relationship continuity — not transactional interactions that reset every time`,
      `Teams with genuinely diverse perspectives — you synthesize best across difference`,
      `Environments that treat communication as a core strategic skill, not just "soft skills"`,
      `Problems where trust and buy-in are as important as the solution itself`,
    ],
    avoid: [
      `Extended solo, heads-down work with no human contact — you'll lose energy and performance`,
      `Pure execution roles with no communication, coordination, or relationship element`,
      `Organizations that treat relationships as overhead or "politics" — they don't value your core skill`,
      `Adversarial or zero-sum competitive cultures where trust is a liability`,
    ],
    burnout: `You burn out by absorbing other people's stress and calling it empathy. You take on emotional weight that isn't yours to carry. The signal is exhaustion after interactions that should feel energizing.`,
    burnout_recovery: `Schedule mandatory solo recovery time — not optional, not if-there's-time. Identify one relationship you're maintaining out of obligation and renegotiate it.`,
    actions: [
      `Map your current network: people you know well (strong ties), people you know loosely (weak ties), people you want to know. Research shows most career opportunities come from weak ties. Reach out to one loose connection this week.`,
      `Write a "translation" piece: take a complex topic in your field and explain it in 300 words for a smart non-expert. Post it somewhere public. This demonstrates your core skill better than a resume can.`,
      `Volunteer to run one meeting, workshop, or discussion in the next two weeks. Connectors need reps at facilitation — it's the skill that unlocks every other Connector role.`,
    ],
    interview: `You're often the most likable candidate in the room, which cuts both ways. Every story needs a concrete outcome. "I brought the team together around a new approach" must end with "...and as a result, X happened, by Y date." Interviewers who like you will give you a pass once. Hiring managers won't.`,
    strategy: `Teach what you've just learned within 24 hours. It locks the concept in and reveals what you don't yet know.`,
    stress: `You absorb others' stress and call it empathy. Guard solo recovery time deliberately.`,
  },

  {
    id: `creator`, label: `Creator`, emoji: `✦`,
    tagline: `You feel when something is wrong before you can explain it. Trust that.`,
    desc: `Aesthetic judgment is a professional skill, and yours is developed. You are drawn to work that requires originality, taste, and the synthesis of influences into something genuinely new. Your best work happens when you have real creative latitude — not when you're executing someone else's vision.`,
    roles: {
      entry: [
        { title:`Junior UX / Product Designer`, path:`Build a portfolio of 3 case studies (process + outcome, not just screenshots). Figma is the tool. Target design-led companies: Figma, Linear, Notion, Apple, small agencies.`, why:`Where aesthetic judgment meets systems thinking — the entry-level version of the most valuable Creator role in tech.` },
        { title:`Content Writer / Strategist`, path:`Start with a portfolio of writing samples (even self-published). Target content roles at SaaS companies, media companies, or agencies.`, why:`Understanding narrative arc and what makes ideas stick — this is Creator thinking applied to words.` },
        { title:`Brand / Marketing Associate`, path:`Target consumer brands, agencies, or DTC companies. Entry via coordinator roles. Build a portfolio that shows taste, not just execution.`, why:`Brand is culture made visible. Creators who understand this are the ones who eventually run it.` },
        { title:`Graphic / Visual Designer`, path:`Strong portfolio > credentials. Dribbble and Behance are the job boards. Your taste is the rare thing — the technical skills are learnable.`, why:`The technical skills are learnable. Your native sense of when something is wrong — that's not.` },
      ],
      mid: [
        { title:`Senior / Staff Product Designer`, path:`3-5 years → IC track at tech companies. Design system ownership, cross-functional leadership, or specialization.`, why:`At senior level, you set the aesthetic direction others execute inside. The leverage compounds.` },
        { title:`Creative Director`, path:`Agency track (3-5 years) or in-house brand track. The role requires both taste and the ability to brief and lead other creatives.`, why:`You set the vision. Others execute it. Your taste becomes the organization's taste.` },
        { title:`Content Strategist / Editorial Director`, path:`Senior path from content writing — usually 4-6 years. Target tech companies with strong editorial cultures (Shopify, Mailchimp, Basecamp).`, why:`Narrative architecture at scale — designing the information system, not just the individual piece.` },
      ],
      pivot: [
        { title:`Founder / Creative Studio`, path:`Many senior Creators eventually go independent — a design studio, creative consultancy, newsletter, or course. The portfolio becomes the business.`, why:`Your taste is the product. At senior level, you can sell it directly.` },
        { title:`Head of Design / VP Creative`, path:`IC → management track. Requires developing the ability to articulate creative decisions in business terms.`, why:`Running the creative function of an organization. High leverage, high stakes.` },
      ],
    },
    industries: [
      { name:`Design-led Tech (Figma, Linear, Notion, Apple)`, fit:5, note:`Companies where design is a core value, not a service function. Your work has influence, not just execution.` },
      { name:`Consumer Brands / DTC`, fit:5, note:`Brand aesthetics drive real revenue here. Creative decisions get made at the leadership level.` },
      { name:`Media & Publishing`, fit:4, note:`Strong fit for Creators who specialize in content, editorial, or visual journalism.` },
      { name:`Advertising / Creative Agencies`, fit:4, note:`Fast feedback cycles, varied briefs, strong craft culture.` },
      { name:`Gaming / Entertainment`, fit:4, note:`High creative latitude in product and marketing.` },
      { name:`Architecture / Industrial Design`, fit:4, note:`Creators who want to work with physical constraints and longer timelines.` },
      { name:`Enterprise SaaS (generic)`, fit:2, note:`Design is often under-resourced and under-valued.` },
      { name:`Traditional Corporate (non-design-native)`, fit:1, note:`Creative work treated as decoration rather than strategy.` },
    ],
    seek: [
      `Roles with genuine creative ownership — not just execution of someone else's vision`,
      `Real constraints (budget, timeline, format) — paradoxically, these unlock your best work`,
      `Teams that give specific, honest feedback — vague praise stalls you worse than criticism`,
      `Work where the output is visible and attributable to you specifically`,
    ],
    avoid: [
      `Work revised perpetually by committee with no clear creative direction — death by a thousand opinions`,
      `Environments where creativity is treated as decoration or "nice to have" rather than strategy`,
      `Pure production pipelines with no room to experiment or iterate between briefs`,
      `Teams that evaluate creative work by whether they personally "like it" rather than whether it works`,
    ],
    burnout: `You burn out by perfectionism — holding work back because it isn't ready yet, then losing the window entirely. The real risk isn't shipping something bad. It's shipping nothing, or shipping it so late that it no longer matters.`,
    burnout_recovery: `Before you start the next project, write down in one sentence what "done" looks like. When you hit that line, ship it. Revise in the next version.`,
    actions: [
      `Start a swipe file — a folder where you collect examples of work in your field that you think is genuinely excellent. For each one, write one sentence: what specifically works, and why. Not "I like this" — why does it work. This sharpens your taste into a vocabulary.`,
      `Make one thing with a 2-hour hard time limit. Not a portfolio piece — a finished artifact. A logo, a headline, a short essay, a one-page layout. The timer is the enemy of perfectionism and the only reliable cure.`,
      `Find a real brief: a student organization, a local business, a friend's side project. Offer to do the creative work for free in exchange for a testimonial and the right to show the work. Creators need a portfolio before they need a job title.`,
    ],
    interview: `Show your process, not just the output. Walk them through one project: (1) what the brief was, (2) what you tried that didn't work and why, (3) what you shipped and the specific decision that made it right. Creators who can articulate their process are trusted with bigger briefs.`,
    strategy: `Use constraints as a tool. Tight briefs, short deadlines, and limited tools unlock your best ideas.`,
    stress: `Perfectionism delays output. Define "done" before you start, then ship it.`,
  },
];


// ─────────────────────────────────────────────
// MBTI → ARCHETYPE ENGINE
// 사주(오행) × MBTI(4축) → 아키타입
//
// MBTI axes:
//   I/E → energy source (solo depth vs social processing)
//   N/S → information (abstract patterns vs concrete facts)
//   T/F → decisions (logic/systems vs values/people)
//   J/P → structure (planned/organized vs flexible/exploring)
//
// Archetype weights per axis:
//   builder:   J↑, T↑, S↑  — structure + logic + concrete
//   analyst:   I↑, N↑, T↑  — depth + patterns + logic
//   connector: E↑, F↑       — social + values/people
//   creator:   P↑, N↑, F↑  — flexible + abstract + feeling
// ─────────────────────────────────────────────

// Parse MBTI string into axis booleans
function parseMBTI(str) {
  if (!str || str.length < 4) return null;
  const s = str.toUpperCase();
  return {
    I: s[0] === 'I',
    N: s[1] === 'N',
    T: s[2] === 'T',
    J: s[3] === 'J',
  };
}

// Score axes (mbtiAxes from parseMBTI or from 4 mini-questions)
function mbtiToScores(axes) {
  const s = { builder:0, analyst:0, connector:0, creator:0 };
  if (!axes) return s;
  const { I, N, T, J } = axes;

  // E/I axis
  if (I)  { s.analyst += 2; s.builder += 1; }
  else    { s.connector += 2; s.creator += 1; }

  // N/S axis
  if (N)  { s.analyst += 1; s.creator += 2; }
  else    { s.builder += 2; }

  // T/F axis
  if (T)  { s.analyst += 2; s.builder += 1; }
  else    { s.connector += 2; s.creator += 1; }

  // J/P axis
  if (J)  { s.builder += 2; s.analyst += 1; }
  else    { s.creator += 2; s.connector += 1; }

  return s;
}


// ─────────────────────────────────────────────
// 旺相休囚死 SEASONAL STRENGTH THEORY
// 계절이론: 일간 오행이 월지 계절에 따라 강약 변화
//
// Reference: 三命通會 (Sanming Tonghui), 淵海子平 (Yuanhai Ziping)
// Month branch → season mapping (solar calendar, hemisphere-independent)
// 寅卯辰(2-4) = Spring/Wood season
// 巳午未(5-7) = Summer/Fire season  
// 申酉戌(8-10) = Autumn/Metal season
// 亥子丑(11-1) = Winter/Water season
// Earth element: transitions between seasons (辰戌丑未 months)
// ─────────────────────────────────────────────

// 旺相休囚死 table: dayMaster element × month season → strength rating
// 旺(Wang)=4: peak season  相(Xiang)=3: supported  休(Xiu)=2: resting
// 囚(Qiu)=1: restrained    死(Si)=0: exhausted
const WANGXIANG = {
  //          Spring  Summer  Autumn  Winter  EarthSeason
  //          寅卯辰   巳午未   申酉戌   亥子丑   辰戌丑未
  Wood:   [    4,      2,      0,      3,      1    ],
  Fire:   [    3,      4,      1,      0,      2    ],
  Earth:  [    1,      3,      2,      0,      4    ],
  Metal:  [    0,      1,      4,      2,      3    ],
  Water:  [    2,      0,      3,      4,      1    ],
};

// Month branch index → season index
// 0=子(winter) 1=丑(earth) 2=寅(spring) 3=卯(spring) 4=辰(earth)
// 5=巳(summer) 6=午(summer) 7=未(earth) 8=申(autumn) 9=酉(autumn)
// 10=戌(earth) 11=亥(winter)
const MONTH_SEASON = [3,4,0,0,4,1,1,4,2,2,4,3]; // 0=spring 1=summer 2=autumn 3=winter 4=earth

function getSeasonalProfile(dmEl, monthBranch) {
  const seasonIdx = MONTH_SEASON[monthBranch] ?? 0;
  const strength = WANGXIANG[dmEl]?.[seasonIdx] ?? 2;
  const seasonNames = ['Spring','Summer','Autumn','Winter','Earth-transition'];
  const seasonKor   = ['봄','여름','가을','겨울','환절기'];
  const branchNames = ['子','丑','寅','卯','辰','巳','午','未','申','酉','戌','亥'];

  // Strength band: 旺(4) 相(3) → 身强 strong; 休(2) → neutral; 囚(1) 死(0) → 身弱 weak
  const band = strength >= 3 ? 'strong' : strength === 2 ? 'neutral' : 'weak';

  const strengthStr = ['Depleted','Restrained','Resting','Supported','Peak'][strength];
  const labels = {
    strong:  { badge:'In-season · ' + strengthStr, en:'Season-Strong', desc:'Your element is in its peak season — energy is naturally amplified.' },
    neutral: { badge:'Between seasons · ' + strengthStr, en:'Balanced', desc:'Your element is between seasons — stable but not amplified.' },
    weak:    { badge:'Out of season · ' + strengthStr, en:'Season-Weak', desc:'Your element is out of season — energy runs deeper and more internal.' },
  };

  return {
    strength, band, seasonIdx,
    season: seasonNames[seasonIdx],
    monthChar: branchNames[monthBranch],
    label: labels[band],
  };
}

// Seasonal style modifier per archetype × strength band
// These MODIFY the existing archetype — they don't replace it
const SEASONAL_MODIFIERS = {
  builder: {
    strong:  {
      style: `External Builder`,
      insight: `Your structural energy is amplified by the season — a natural advantage for leading projects, setting direction, and building at scale. You work best when given full ownership.`,
      careerLens: `Lean toward roles with high ownership and scope. This configuration drives well in environments that move fast and reward decisive system-building.`,
      watch: `Overextension risk is higher — you have energy to take on more than is wise. Define scope boundaries before committing.`,
    },
    neutral: {
      style: `Steady Builder`,
      insight: `Consistent, methodical energy — not the most amplified, but highly reliable. You build well over long cycles without burning out.`,
      careerLens: `Stable, process-oriented environments suit you best. You're well-matched for roles that compound over time rather than sprint.`,
      watch: `Momentum can plateau. Deliberately inject new constraints or problems to stay engaged.`,
    },
    weak:    {
      style: `Deep Builder`,
      insight: `Your structural instinct is strong but internally directed — you think in systems more than you broadcast them. Best work happens in focused, low-distraction environments.`,
      careerLens: `Individual contributor or small-team roles where depth is valued over visibility. Your systems thinking is real — it just needs the right container.`,
      watch: `Visibility matters for career advancement. Periodically surface your work even when you'd rather stay in the process.`,
    },
  },
  analyst: {
    strong:  {
      style: `Expansive Analyst`,
      insight: `Analytical energy is at its sharpest — pattern recognition, synthesis, and insight generation are all heightened. This is the configuration that produces breakthrough analysis.`,
      careerLens: `High-complexity, high-stakes roles are your lane right now. Research leadership, senior advisory, or founding roles in data-intensive fields.`,
      watch: `Overconfidence in your own conclusions. The sharpest analysts also build in adversarial testing of their own work.`,
    },
    neutral: {
      style: `Grounded Analyst`,
      insight: `Analytical depth is solid and consistent. You're not in a peak output cycle, but your judgment is reliable and your conclusions hold up well under scrutiny.`,
      careerLens: `Execution-oriented analyst roles — where the value is in reliable, consistent output rather than breakthrough insight.`,
      watch: `Intellectual restlessness. Seek problems that have genuine depth, not just complexity.`,
    },
    weak:    {
      style: `Focused Analyst`,
      insight: `Analytical energy is more conserved and internal. Your insights run deep but are slow to surface — you need time and low noise to produce your best work.`,
      careerLens: `Research, independent analysis, and roles where you control the pace and depth of your work. Avoid high-pressure, rapid-fire analytical environments.`,
      watch: `Undervaluing your own conclusions. Slow-built insight is often more durable than fast analysis — trust it.`,
    },
  },
  connector: {
    strong:  {
      style: `Magnetic Connector`,
      insight: `Social and relational energy is at its peak — your read on people, your ability to bridge, and your presence in conversations are all amplified. People are drawn to you naturally right now.`,
      careerLens: `High-visibility roles — leadership, business development, community-building, public-facing positions. This configuration drives well in environments that run on relationships.`,
      watch: `Saying yes to too many people. Your capacity to connect is high, but it's not unlimited.`,
    },
    neutral: {
      style: `Reliable Connector`,
      insight: `Steady, warm relational energy. Not at peak amplification, but deeply trustworthy — people feel safe with you over time rather than immediately drawn.`,
      careerLens: `Long-cycle relationship roles — account management, partnership development, mentorship. You're built for depth, not breadth.`,
      watch: `Underinvesting in your own network. Reliable connectors sometimes focus entirely on others and neglect building their own strategic relationships.`,
    },
    weak:    {
      style: `Selective Connector`,
      insight: `Relational energy is more internalized — you connect deeply with a small number of people rather than widely. One strong relationship you build is worth ten surface ones.`,
      careerLens: `Roles with small, high-trust team structures. Avoid large-scale networking or high-volume relationship management roles — your energy doesn't scale that way.`,
      watch: `Isolation risk. Make deliberate effort to maintain key relationships even when social energy is low.`,
    },
  },
  creator: {
    strong:  {
      style: `Expressive Creator`,
      insight: `Creative energy is externalized and amplified — this is the configuration that produces visible, bold work. Your taste is sharp, your output is prolific, and your instincts are accurate.`,
      careerLens: `High-visibility creative roles — creative direction, public-facing design, brand leadership. This is when you should be showing work, not refining it in private.`,
      watch: `Prolificity can dilute quality. Apply your amplified energy to fewer, better things.`,
    },
    neutral: {
      style: `Refined Creator`,
      insight: `Creative energy is stable and discerning. Not at peak output, but your taste is highly calibrated — you're better at editing, curating, and refining than at generating volume.`,
      careerLens: `Curation, creative strategy, and editing-intensive roles. Your value right now is in the quality of your judgment, not the volume of your output.`,
      watch: `Perfectionism risk. Stable energy can create a loop of endless refinement. Set a "done" line.`,
    },
    weak:    {
      style: `Internalized Creator`,
      insight: `Creative energy is running deep and private — your best ideas are forming below the surface. This is often the phase just before a creative breakthrough.`,
      careerLens: `Deep-focus creative work — writing, research-based creation, long-form projects. Avoid roles that require constant public creative output on short deadlines.`,
      watch: `Don't mistake this for a creative block. The internalization IS the work. Give it time.`,
    },
  },
};

function getSeasonalModifier(archetypeId, band) {
  return SEASONAL_MODIFIERS[archetypeId]?.[band] || null;
}

// ─────────────────────────────────────────────────────────────
// CAREER TIMING ENGINE
// Decennial Luck Cycles (大運) + Annual Luck (歲運)
// Based on: Zi Ping methodology, solar calendar Jieqi boundaries
// ─────────────────────────────────────────────────────────────

// Ten Influences — the relationship between Day Master and any stem
// Determines the "flavor" of each decade
function getTenInfluence(dmEl, dmPol, targetEl, targetPol) {
  const generates = { Wood:'Fire', Fire:'Earth', Earth:'Metal', Metal:'Water', Water:'Wood' };
  const controls  = { Wood:'Earth', Fire:'Metal', Earth:'Water', Metal:'Wood', Water:'Fire' };
  const sameEl = dmEl === targetEl;
  const samePol = dmPol === targetPol;
  if (sameEl)                             return samePol ? 'Peer'      : 'Rival';
  if (generates[dmEl] === targetEl)       return samePol ? 'Output'    : 'Expression';
  if (controls[dmEl] === targetEl)        return samePol ? 'Windfall'  : 'Wealth';
  if (controls[targetEl] === dmEl)        return samePol ? 'Pressure'  : 'Authority';
  if (generates[targetEl] === dmEl)       return samePol ? 'Mentor'    : 'Resource';
  return 'Peer';
}

const INFLUENCE_META = {
  Peer:       { label:'Peer',       theme:'Independence · Self-reliance',   color:'#7a9e6e' },
  Rival:      { label:'Rival',      theme:'Competition · Challenge',        color:'#5a8e5e' },
  Expression: { label:'Expression', theme:'Creativity · Skill display',     color:'#c06030' },
  Output:     { label:'Output',     theme:'Innovation · Breaking norms',    color:'#b05020' },
  Wealth:     { label:'Wealth',     theme:'Execution · Real-world results', color:'#a88840' },
  Windfall:   { label:'Windfall',   theme:'Opportunity · Expansion',        color:'#c09820' },
  Authority:  { label:'Authority',  theme:'Structure · Formal recognition', color:'#8896a0' },
  Pressure:   { label:'Pressure',   theme:'Challenge · Growth through friction', color:'#6876a0' },
  Resource:   { label:'Resource',   theme:'Learning · Credentials',         color:'#5080a0' },
  Mentor:     { label:'Mentor',     theme:'Intuition · Unconventional path',color:'#3860a0' },
};

// ─────────────────────────────────────────────────────────────
// CAREER TIMING CONTENT
// Structure: decade context (what kind of energy this 10yr brings)
//            + cross_reading (decade × annual year = combined NOW insight)
//            + now_actions (2 concrete things to do in the next 3 months)
// ─────────────────────────────────────────────────────────────

// Decade context — brief, what the 10-year window is fundamentally about
const DECADE_CONTEXT = {
  builder: {
    Peer:       `An independence decade. The conditions favor building something under your own name — your energy aligns with itself, which makes self-directed work unusually effective right now.`,
    Rival:      `A competitive pressure decade. External challengers are testing your systems. Uncomfortable, but the builders who come out of Rival decades are the most credible ones in the room.`,
    Expression: `A visibility decade. Your craft is ready to find an audience. The work you've been building in private wants to surface — this decade rewards showing, not hiding.`,
    Output:     `A disruption decade. Standard approaches feel inadequate because you can see better ways. This is when builders ship their most unconventional — and often most consequential — work.`,
    Wealth:     `An execution decade. Ideas convert to outcomes. The decade where plans become real products, real revenue, real systems that other people depend on.`,
    Windfall:   `An expansion decade. Scope grows beyond what you planned — larger teams, bigger problems, unexpected markets. The risk is spreading too thin. The opportunity is building infrastructure that compounds.`,
    Authority:  `A leadership decade. Organizational structure moves in your favor. The builder who has been delivering earns a formal seat at the table.`,
    Pressure:   `A proving decade. Tight constraints, high stakes, external demands. Uncomfortable — but the builder who navigates this intact becomes the most trusted one in any room.`,
    Resource:   `A foundation decade. The return is in what you build underneath — deep technical skill, credentials, mentorship. What you accumulate now drives the following two decades.`,
    Mentor:     `An unconventional thinking decade. Unusual approaches outperform standard ones. The builder who thinks differently in this decade builds the most distinctive body of work.`,
  },
  analyst: {
    Peer:       `A collaborative inquiry decade. Working alongside people who think like you sharpens your own thinking. The analyst compounds fastest with genuine intellectual exchange.`,
    Rival:      `A contested conclusions decade. Your analysis will be challenged — and that's where the value is. The analyst who can defend and revise under pressure becomes the most trusted voice.`,
    Expression: `A publication decade. Insights that have been forming in private are ready to surface. The analyst who externalizes their thinking now builds the most durable reputation.`,
    Output:     `A paradigm-questioning decade. Standard frameworks feel insufficient. This is when analysts do their most heterodox, highest-impact work — the questions the field has been avoiding.`,
    Wealth:     `An applied research decade. Analysis connects to real decisions and outcomes. The analyst who turns insight into action earns the most leverage this decade.`,
    Windfall:   `An expanded scope decade. Your analytical domain widens unexpectedly. Cross-industry moves, new data territories — the analyst who stays flexible discovers their most productive area.`,
    Authority:  `A recognition decade. Analytical credibility earns formal authority. The transition from individual contributor to knowledge leader happens in decades like this.`,
    Pressure:   `A high-stakes decade. Real decisions depend on your conclusions — with imperfect information and limited time. The discipline you build here determines your ceiling.`,
    Resource:   `A depth decade. Go deep on one domain. The analyst who builds genuine depth now emerges with a differentiated knowledge base that takes competitors years to replicate.`,
    Mentor:     `An intuitive breakthrough decade. Logic alone doesn't explain what you're seeing — trust it. The analyst's most original work often emerges here, before the world has language for it.`,
  },
  connector: {
    Peer:       `A community-building decade. Like-minded collaborators appear. The connector's most natural decade — invest in relationships that feel easy, because they're the ones that compound.`,
    Rival:      `A relational tension decade. Partnerships get tested, competing interests surface. Uncomfortable — but you come out with a much clearer sense of who your actual allies are.`,
    Expression: `A teaching decade. Knowledge flows outward. The connector who teaches what they know now builds the highest-leverage reputation. People remember who made complex things clear.`,
    Output:     `A boundary-crossing decade. Bridges form across industries and disciplines that wouldn't normally connect. The connector in this decade creates the most unconventional — and often most valuable — relationships.`,
    Wealth:     `A conversion decade. Relationships translate into real partnerships, contracts, collaborations. The connector who has been building trust now converts it into tangible results.`,
    Windfall:   `An unexpected alliances decade. The most consequential connections come from unexpected directions. The connector who's too focused on planned outreach misses the most important introductions.`,
    Authority:  `A leadership decade. Relational capital earns formal authority. The connector becomes the person everyone routes important conversations through.`,
    Pressure:   `A high-stakes mediation decade. Conflict, difficult negotiations, broken trust — you're in the room when things are most complicated. The rarest skill gets built here.`,
    Resource:   `A receiving decade. Good mentors, strong advocates, institutional backing. The connector who is generous in receiving as well as giving builds the most resilient network.`,
    Mentor:     `An instinctive connections decade. You meet people before you know why they matter. Follow the instinct — the connector in this decade makes introductions that look inexplicable until years later.`,
  },
  creator: {
    Peer:       `A creative community decade. Fellow makers, collaborators, critics who get it. The creator's best work rarely happens in isolation — Peer decades provide the audience and friction needed to develop a real voice.`,
    Rival:      `A style-under-pressure decade. Your taste gets tested against competing aesthetics. The creator who survives this with their voice intact has something real.`,
    Expression: `A prolific output decade. The creator's most naturally productive decade — energy flows outward without forcing it. This is not the decade to sit on ideas.`,
    Output:     `A reinvention decade. Existing forms feel inadequate. New mediums, hybrid approaches, genre-crossing — this is when creators make their most experimental and often most influential work.`,
    Wealth:     `A creative business decade. Work converts to income. The creator who has been developing taste and skill earns real returns — clients, commissions, commercial projects. Don't undersell the work.`,
    Windfall:   `An unexpected reach decade. Audiences and platforms appear from unexpected directions. The breakout moment that feels arbitrary is not — it's compounded previous work finding the right channel.`,
    Authority:  `A creative leadership decade. Individual craft scales to direction. The creator who earns authority now sets the aesthetic standard others execute against.`,
    Pressure:   `A professional discipline decade. Deadlines, client constraints, external expectations. The creator learns to finish under pressure without compromising what matters. The most commercially capable creators are forged here.`,
    Resource:   `A deep study decade. Go back to source material. Masters you admire, disciplines you haven't studied. The creator who invests in learning now produces their most technically accomplished work in the decades that follow.`,
    Mentor:     `A singular instinct decade. Strange references, inexplicable aesthetic pulls, work that doesn't fit any category — follow it. The creator's most original output often emerges here.`,
  },
};

// Cross-reading: decade influence × annual year influence → combined NOW insight
// Format: { headline, body, actions: [string, string] }
// 10 × 10 = 100 combinations per archetype — we cover the most common pairings
// and use smart fallbacks for the rest

function getCrossReading(archetypeId, decadeInf, annualInf) {
  // Specific 2026 year cross-readings (annualInf for 2026 丙午 varies by DM)
  // We generate contextual insight by combining decade + annual energy types
  const decadeMeta = INFLUENCE_META[decadeInf];
  const annualMeta = INFLUENCE_META[annualInf];

  // Archetype-specific cross-reading logic
  const cross = CROSS_READINGS[archetypeId]?.[decadeInf]?.[annualInf];
  if (cross) return cross;

  // Smart fallback: generate from decade + annual meta
  return buildFallbackCross(archetypeId, decadeInf, annualInf, decadeMeta, annualMeta);
}

function buildFallbackCross(archetypeId, decadeInf, annualInf, dMeta, aMeta) {
  // Tension or alignment?
  const aligned = ['Peer','Expression','Wealth','Windfall'].includes(annualInf);
  const challenging = ['Rival','Pressure','Output'].includes(annualInf);

  const archetypeActions = {
    builder:   ['Identify one system or process you can own end-to-end this quarter', 'Ship something — even a prototype. Visible output now compounds into the decade.'],
    analyst:   ['Pick one question you\u2019ve been circling and commit to publishing your take', 'Find one person whose thinking sharpens yours and create a reason to exchange ideas'],
    connector: ['Map your current network: who\u2019s drifted, who\u2019s new, who you\u2019ve been meaning to reach', 'Initiate one introduction this month that serves both parties — pure connector move'],
    creator:   ['Identify what work you\u2019ve been holding back and set a ship date for it', 'Define what \u201cdone\u201d looks like for one project — and hold that line'],
  };

  const tone = challenging
    ? `2026 brings ${aMeta.theme.toLowerCase()} energy into your ${dMeta.theme.toLowerCase()} decade. The friction is intentional — this year is calibrating something.`
    : `2026's ${aMeta.theme.toLowerCase()} energy amplifies what this decade is already building. The conditions are aligned — use them.`;

  return {
    headline: `${dMeta.label} decade · ${aMeta.label} year`,
    body: tone,
    actions: archetypeActions[archetypeId] || ['Focus on what you can control', 'Take one concrete step forward this week'],
  };
}

// Specific cross-readings for high-signal combinations
const CROSS_READINGS = {
  builder: {
    Wealth: {
      Rival:     { headline: `Execute under scrutiny`, body: `Your decade says build real things — your year says do it while being watched and compared. That combination is uncomfortable but it's also the fastest credibility engine. Ship the thing others are debating. Let the output answer the competition.`, actions: [`Launch or finalize one project that's been "almost ready" — the year's competitive energy means the window is now`, `Document your build process publicly (blog, GitHub, LinkedIn). Wealth decade means the work needs to be visible to convert.`] },
      Authority: { headline: `Build toward ownership`, body: `Execution energy this decade, structure and recognition this year. This is the rare combination where doing the work and being recognized for it happen in the same window. Push for formal ownership — title, scope, credit.`, actions: [`Identify one area where you're doing the work but not getting the ownership — make the ask`, `Deliver one high-visibility project from start to finish, solo or as clear lead`] },
      Expression:{ headline: `Make the work visible`, body: `Wealth decade means converting skill into outcomes. Expression year means the channel is open. This is the combination where showing your work earns disproportionate returns — what you demonstrate now lands harder than it would in other years.`, actions: [`Create one public artifact of your best work — case study, writeup, demo`, `Reach out to 3 people you want to work with. Expression energy makes cold outreach land better than usual.`] },
      Peer:      { headline: `Build with someone`, body: `Your execution decade gains traction through collaboration this year. Find the person whose skills complement yours and build something together. Peer year means the right co-builder is findable right now.`, actions: [`Identify one person you've wanted to collaborate with and propose a concrete, scoped project`, `Join or form one small group of builders in your space — the network compounds into the decade`] },
      Windfall:  { headline: `Say yes to bigger scope`, body: `Execution decade, unexpected opportunity year. The combination means something larger than you planned is available — and your decade gives you the capacity to execute on it. The risk of undershooting is higher than the risk of overreaching right now.`, actions: [`Identify the biggest opportunity in your current field and find one concrete way to pursue it`, `Raise your ask — in rates, scope, or role. Windfall years reward reaching.`] },
      Resource:  { headline: `Invest to multiply`, body: `Your execution decade accelerates when you upgrade your inputs. This year's Resource energy says the ROI on learning is unusually high — a skill or credential you acquire now will pay dividends across the rest of this decade.`, actions: [`Identify one technical skill gap that's been slowing your execution and commit to closing it`, `Find one mentor or senior practitioner to learn from directly — not a course, a person`] },
      Pressure:  { headline: `Prove it under constraints`, body: `Wealth decade wants results. Pressure year means the constraints are real and the stakes are high. This combination builds the most credible builders — the ones who shipped when it was hard.`, actions: [`Pick the hardest problem on your plate and move it first this quarter`, `Set a public commitment to one deliverable with a real deadline — accountability accelerates execution`] },
    },
    Expression: {
      Rival:     { headline: `Show work in a competitive field`, body: `Visibility decade, comparison year. Your instinct might be to wait until it's perfect — that's the wrong move. The Expression decade is opening a window and the Rival year is full of people walking through it. Go now, iterate publicly.`, actions: [`Publish something this month — a project, article, or detailed post about what you're building`, `Enter one competitive context: hackathon, open application, public review. Rival years sharpen through exposure.`] },
      Wealth:    { headline: `Convert visibility to income`, body: `You've been building something worth showing. Now the annual energy supports converting that into real returns. Don't let this year pass without attaching a number to your work.`, actions: [`Identify your most visible skill and price it — freelance rate, consulting scope, product idea`, `Have one conversation about money with someone who might hire or pay you`] },
    },
    Resource: {
      Peer:      { headline: `Learn alongside people`, body: `Foundation decade, community year. The fastest way to build deep skill right now is inside a cohort, not alone. Find the room with people a few years ahead of you and get in it.`, actions: [`Identify one program, community, or cohort in your field worth joining this year`, `Find one person whose career is 5 years ahead of yours and ask for a single conversation`] },
      Expression:{ headline: `Document what you're learning`, body: `You're in a foundation decade — which means the learning is real. Expression year means sharing it publicly has unusually high returns. Writing about what you're figuring out is both how you process it and how you build reputation simultaneously.`, actions: [`Start a minimal writing practice: one thing you learned this week, published somewhere`, `Pick one project you're working on and write up what you've figured out — even half-formed`] },
    },
  },
  analyst: {
    Wealth: {
      Expression:{ headline: `Publish what you know`, body: `Applied research decade, visibility year. The combination that turns analysts into thought leaders. What you've been figuring out in private is ready for an audience — and this year's energy makes the publishing land.`, actions: [`Write and publish one piece of analysis you've been sitting on`, `Identify one decision-maker who should read your work and send it to them directly`] },
      Rival:     { headline: `Defend your conclusions`, body: `Your analysis needs to survive contact with people who disagree. Rival year in a Wealth decade means the debates are productive — they pressure-test your work and raise your profile. Don't avoid the argument.`, actions: [`Take one position publicly and defend it when challenged — a post, a comment, a talk`, `Find the smartest person who disagrees with you on something important and have the conversation`] },
      Authority: { headline: `Step into advisory roles`, body: `Execution decade, structure year. This is when the analyst stops informing decisions and starts making them — or being officially recognized as the person who should. Push for the formal role.`, actions: [`Identify one committee, board, or advisory role in your field and apply or ask to be considered`, `Volunteer to own one consequential analytical project at work with full decision authority`] },
      Peer:      { headline: `Find your intellectual peers`, body: `Applied research decade gains depth through exchange. Peer year means the right intellectual partners are findable right now. The analyst who has a thinking partner compounds faster than the one working alone.`, actions: [`Find one person who thinks rigorously about the same problems you do and propose a regular exchange`, `Join or start one small research group, reading group, or study cohort`] },
    },
    Expression: {
      Wealth:    { headline: `Turn analysis into product`, body: `Publication decade, execution year. This combination builds the analyst who earns from their thinking — newsletter, consulting, research product. The output channel is open and the year supports monetizing it.`, actions: [`Define one way your analytical work could generate direct income — even a small experiment`, `Publish one piece and include a clear call to action (hire me, reply if this resonates, follow for more)`] },
      Rival:     { headline: `Sharpen your voice through opposition`, body: `Visibility decade, challenge year. The most distinctive analytical voices are forged when they take positions and defend them. This year rewards having a perspective, not just reporting findings.`, actions: [`Write one piece that takes a clear position on a contested question in your field`, `Respond directly to an analysis you disagree with — publicly, with rigor`] },
      Pressure:  { headline: `Write under deadline`, body: `Expression decade with high-pressure year. Your best analytical writing might come from constraints right now — a hard deadline, a live audience, a specific problem. Stop waiting for the perfect conditions.`, actions: [`Commit to publishing one piece per month for the next quarter — no exceptions`, `Pitch yourself to speak or present somewhere. Pressure year makes the preparation intense but the output worth it.`] },
    },
    Resource: {
      Mentor:    { headline: `Go deep on the unconventional`, body: `Foundation decade, intuition year. The signal you've been following that doesn't quite fit the mainstream — this is the year to chase it seriously. The combination supports building expertise in something before it's obvious.`, actions: [`Identify the most contrarian research question you're genuinely curious about and spend serious time on it`, `Find one practitioner who works in a non-obvious corner of your field and learn from them`] },
      Peer:      { headline: `Learn in community`, body: `Depth decade, collaboration year. The fastest path to mastery right now runs through peers, not solo study. Find the room where people are working on the same hard problems.`, actions: [`Identify one academic, professional, or online community doing serious work in your area`, `Propose one collaborative project with someone whose expertise complements yours`] },
    },
  },
  connector: {
    Wealth: {
      Expression:{ headline: `Teach what you know publicly`, body: `Conversion decade, visibility year. Your relational knowledge is ready to scale. This combination means teaching — writing, speaking, courses — earns unusually high returns right now. What you make clear for others is also what makes people want to work with you.`, actions: [`Identify one thing you understand about people or systems that others find confusing — and explain it publicly`, `Create one piece of content from your experience: a thread, a talk, a short guide`] },
      Rival:     { headline: `Compete through relationships`, body: `Conversion decade, comparison year. The connector's competitive advantage is always the same: you know more people, and those people are genuinely glad to hear from you. Rival years sort out who has real relationships versus transactional ones.`, actions: [`Reach out to 10 people you haven't spoken to in 6+ months — no ask, just genuine reconnection`, `Identify one competitive situation you're in and ask: who in your network could change this outcome?`] },
      Authority: { headline: `Formalize your influence`, body: `Your relational capital is at a point where it should translate into formal recognition. Wealth decade plus Authority year means the timing is right to turn trust into title, scope, or institutional role.`, actions: [`Identify one leadership role you're informally doing and make the case for doing it officially`, `Sponsor or champion someone else publicly — Authority year rewards visible investment in others`] },
      Peer:      { headline: `Rebuild the core network`, body: `Conversion decade, community year. This is the year to deepen the relationships that actually matter — not add to the list. Quality over quantity has an unusually high ROI right now.`, actions: [`Identify your 10 most important professional relationships and make sure each one is active`, `Host or organize something small — a dinner, a call, a workshop. Peer year makes people want to show up.`] },
    },
    Expression: {
      Wealth:    { headline: `Monetize your network`, body: `Teaching decade, execution year. This combination specifically supports building something people pay for from your ability to connect and explain. The audience is there. The channel is open. What's the product?`, actions: [`Identify one paid offering that uses your connecting or teaching skill`, `Make one introduction this month that creates real value for both parties — and let them know it came from you`] },
      Rival:     { headline: `Make yourself the obvious choice`, body: `Visibility decade, competitive year. Others are making noise — your move is to be the clearest, most useful, most responsive person in the room. Rival years reward consistency and genuine helpfulness over flashiness.`, actions: [`Identify one professional context where you want to be better known and show up there consistently for 90 days`, `Write or share something helpful in your field every week this quarter`] },
    },
    Resource: {
      Peer:      { headline: `Find mentors who will invest in you`, body: `Foundation decade, community year. The right people to learn from right now are findable — and Peer year means they're open to exchange, not just one-way teaching. Look for the relationship where you bring something too.`, actions: [`Identify 3 people you want to learn from and find a genuine way to be useful to them first`, `Ask explicitly for a mentorship or advisory relationship with someone whose career you admire`] },
    },
  },
  creator: {
    Wealth: {
      Rival:     { headline: `Ship while being compared`, body: `Creative business decade, comparison year. Your instinct is to wait until it's better. The Rival year is full of other creators shipping. The decade says your work converts — but only if it's out there. Imperfect and published beats perfect and private every time this year.`, actions: [`Set a specific date in the next 30 days to publish, launch, or share something you've been holding`, `Submit your work to one competitive context: a call for submissions, a pitch, a public review`] },
      Expression:{ headline: `Make more, show more`, body: `The decade wants your work to convert into income. The year wants you to be visible. This combination is the creative's best alignment — lean into volume right now. The output itself is the marketing.`, actions: [`Commit to one public creative output per week for the next 6 weeks`, `Identify your best existing work and actively share it — not just post it, put it in front of specific people`] },
      Authority: { headline: `Lead creatively`, body: `Commercial decade, structure year. This combination moves creators into creative direction — not just making things, but setting the standard for how things get made. Push for the senior role or the project with real creative ownership.`, actions: [`Identify one project where you could have true creative authority (not execution) and pursue it`, `Write down your creative principles — what you stand for, what you won't compromise. Authority roles require you to articulate this.`] },
      Peer:      { headline: `Build with your creative community`, body: `Conversion decade, community year. The solo creator model undersells this combination. Collaboration, co-creation, and building with peers amplifies what your decade is already supporting. Who are you making things with?`, actions: [`Identify one creator whose work complements yours and propose a collaboration`, `Find or create one small creative community — even 3-5 people meeting regularly around shared work`] },
      Windfall:  { headline: `Follow the unexpected channel`, body: `Your decade is about creative work converting to real returns. Windfall year means the platform or audience that finds you might not be the one you expected. Stay open — and make sure you're findable across multiple channels.`, actions: [`Publish or share work on one platform you haven't used seriously before`, `Say yes to one unexpected creative opportunity this quarter, even if it's outside your usual lane`] },
    },
    Expression: {
      Rival:     { headline: `Develop your voice through contrast`, body: `Prolific output decade, competitive year. The Rival energy isn't a threat — it's a mirror. Seeing what other creators are making clarifies what only you can make. Use the comparison to sharpen your perspective, then ship from that sharper place.`, actions: [`Identify what makes your creative work different from the 5 creators closest to your lane — write it down`, `Make one piece that could only come from you. Not a genre piece. Your actual perspective.`] },
      Wealth:    { headline: `Turn output into income`, body: `Expression decade wants you making and showing. Wealth year wants the making to convert. This is when the prolific creator starts attaching prices to their output — and finding out what lands.`, actions: [`Identify your most-engaged creative output and design one way to monetize it`, `Raise your rate or price for one offering by 20%. Expression decade plus Wealth year supports it.`] },
      Output:    { headline: `Experiment aggressively`, body: `Both your decade and this year push toward breaking existing forms. This combination is rare — when the internal drive to experiment and the external energy supporting it align. Make the weird thing. The unconventional output from this window is often what defines a career.`, actions: [`Identify one format, medium, or genre you've never tried and make something in it this quarter`, `Abandon one creative constraint you've been treating as fixed and see what happens`] },
    },
    Resource: {
      Mentor:    { headline: `Follow the strange curiosity`, body: `Deep study decade, intuitive year. The reference that doesn't make obvious sense, the discipline that seems unrelated — this combination is specifically good for building the creative vocabulary that no one else has. Study the thing others overlook.`, actions: [`Identify one non-obvious creative influence and spend serious time with it this quarter`, `Make one piece directly inspired by a source outside your usual references`] },
      Expression:{ headline: `Document the learning publicly`, body: `You're building foundational creative skill this decade. Expression year means sharing the process earns unusually high returns — not the finished work, the figuring-out. Process content from a Resource decade is some of the most valuable a creator can make.`, actions: [`Share one behind-the-scenes look at your creative process — how you're learning, what you're figuring out`, `Start a minimal public log of your creative development: weekly or monthly, short, honest`] },
    },
  },
};

// Generate decennial luck cycle pillars (8 decades)
function calcDayunPillars(monthSI, monthBI, isForward) {
  return Array.from({length: 8}, (_, i) => {
    const dir = isForward ? i + 1 : -(i + 1);
    const si = ((monthSI + dir) % 10 + 10) % 10;
    const bi = ((monthBI + dir) % 12 + 12) % 12;
    return { si, bi, el: STEM_EL[si], pol: STEM_POL[si], branchEl: BRANCH_EL[bi] };
  });
}

// Full timing calculation
function calcTiming(bazi, birthYear, currentAge, gender) {
  const { pillars, dm } = bazi;
  const mSI = pillars.month.s, mBI = pillars.month.b;

  // Direction rule (Zi Ping methodology):
  //   Yang DM + Male   → forward (순행)
  //   Yang DM + Female → backward (역행)
  //   Yin  DM + Male   → backward (역행)
  //   Yin  DM + Female → forward (순행)
  const isYang = dm.pol === 'Yang';
  const isMale = gender === 'male';
  const isForward = (isYang && isMale) || (!isYang && !isMale);

  // Accurate start age: days between birth and nearest jieqi boundary ÷ 3
  // Use actual JIEQI data — same data used for month pillar calculation
  const bUTC  = bazi.birthUTC;
  const bYear = bazi.birthYear || birthYear;
  const sol   = bazi.jieqiSol ?? 11; // month index in jieqi steps (0-11)

  // steps mapping: sol index → jieqi index in JIEQI array
  // sol=11 means before year's first jieqi (lichun), sol=0..10 = steps[0..10]
  const jqSteps = [1,2,3,4,5,6,7,8,9,10,11,0]; // jieqi indices for sol 0..11
  const curJqIdx  = jqSteps[sol] ?? 0;
  const prevJqIdx = jqSteps[(sol - 1 + 12) % 12] ?? 11;
  const nextJqIdx = jqSteps[(sol + 1) % 12] ?? 1;

  // Get timestamps of surrounding jieqi
  // current month's jieqi start (this is prevBoundary for birth month)
  let prevJqTS = null, nextJqTS = null;
  try {
    // Previous boundary = start of current month
    const prevYr = sol === 11 ? bYear - 1 : bYear;
    const prevIdx = sol === 11 ? 0 : curJqIdx;
    const pd = JIEQI[prevYr];
    if (pd && pd[prevIdx]) { const [mo,dy,h,mi] = pd[prevIdx]; prevJqTS = Date.UTC(prevYr, mo-1, dy, h, mi); }

    // Next boundary = start of next month
    const nextYr = sol === 10 ? bYear + 1 : bYear;
    const nextIdx = sol === 10 ? 0 : nextJqIdx;
    const nd = JIEQI[nextYr];
    if (nd && nd[nextIdx]) { const [mo,dy,h,mi] = nd[nextIdx]; nextJqTS = Date.UTC(nextYr, mo-1, dy, h, mi); }
  } catch(e) {}

  let daysFromJieqi = 10; // fallback
  if (isForward && nextJqTS) {
    daysFromJieqi = (nextJqTS - bUTC) / 86400000;
  } else if (!isForward && prevJqTS) {
    daysFromJieqi = (bUTC - prevJqTS) / 86400000;
  }
  daysFromJieqi = Math.max(0.5, Math.abs(daysFromJieqi));
  const startAge = Math.round((daysFromJieqi / 3) * 10) / 10;

  const pillarsArr = calcDayunPillars(mSI, mBI, isForward);
  const dayuns = pillarsArr.map((p, i) => {
    const fromAge = Math.round((startAge + i * 10) * 10) / 10;
    const toAge   = Math.round((startAge + (i + 1) * 10) * 10) / 10;
    const inf     = getTenInfluence(dm.el, dm.pol, p.el, p.pol);
    const meta    = INFLUENCE_META[inf] || INFLUENCE_META['Peer'];
    return { ...p, fromAge, toAge,
             fromYear: birthYear + Math.floor(fromAge),
             toYear:   birthYear + Math.floor(toAge),
             inf, meta };
  });

  const curIdx = dayuns.findIndex(d => currentAge >= d.fromAge && currentAge < d.toAge);
  const curIdx2 = curIdx < 0 ? 0 : curIdx;

  // Annual luck: 2026 = Bing Wu year (Fire Yang stem, Fire branch)
  const annualSI = 2, annualBI = 6; // 丙=2, 午=6
  const annualInf  = getTenInfluence(dm.el, dm.pol, STEM_EL[annualSI], STEM_POL[annualSI]);
  const annualMeta = INFLUENCE_META[annualInf] || INFLUENCE_META['Peer'];

  return { dayuns, curIdx: curIdx2, isForward, startAge, annualInf, annualMeta };
}


// Pillar element boost (same as before)
const EL_BOOST = {
  Wood:   { builder:1, creator:2 },
  Fire:   { connector:3, creator:1 },
  Earth:  { builder:2, connector:1 },
  Metal:  { builder:3, analyst:1 },
  Water:  { analyst:3, creator:1 },
};

// Combine MBTI scores + element boost → top 2 archetypes
function calcArchetypes(axes, dmEl, monthBranch) {
  const mbtiS = mbtiToScores(axes);
  const elB   = EL_BOOST[dmEl] || {};
  const final = {};
  // MBTI: 60% weight, 오행: 40% weight
  for (const a of ARCHETYPES) {
    final[a.id] = (mbtiS[a.id] || 0) * 0.6 + (elB[a.id] || 0) * 0.4;
  }
  // ── Creator correction ──────────────────────────────────────────
  // Problem: T+J axes structurally suppress Creator (Creator weights P+N+F).
  // Real-world creative professionals (artists, designers, architects) are
  // often INTJ/ISTJ with Wood or Fire element. Apply element-driven correction:
  //   Wood+N  → intuitive + growth energy  → strong Creator signal
  //   Fire+N  → expressive + intuitive     → Creator signal
  //   Wood/Fire + (any) → mild boost if already close
  if (axes) {
    const { N, T, J } = axes;
    // Case 1: Intuitive types with creative elements — suppress T+J penalty
    if (N && (dmEl === 'Wood' || dmEl === 'Fire')) {
      final.creator += 1.8;
    }
    // Case 2: Wood element is inherently creative/growth — boost regardless of N
    if (dmEl === 'Wood') {
      final.creator += 0.8;
    }
    // Case 3: Fire element is expressive — mild boost
    if (dmEl === 'Fire') {
      final.creator += 0.5;
    }
    // Case 4: T+J combo is very strong — if element is creative, partially offset
    if (T && J && (dmEl === 'Wood' || dmEl === 'Fire')) {
      final.creator += 0.6; // partial offset for artistic TJ types
    }
  }
  // ────────────────────────────────────────────────────────────────
  const sorted = Object.entries(final).sort((a,b) => b[1]-a[1]);
  return {
    top2:   sorted.slice(0,2).map(([id]) => ARCHETYPES.find(a => a.id === id)),
    scores: final,
  };
}

// Stress flag: I + J combination (internalizes, over-systematizes under stress)
function stressFlag(axes) {
  if (!axes) return false;
  return axes.I && axes.J;
}

// 4 mini-questions shown only when MBTI unknown
const MINI_Q = [
  { axis:'I', text:'Which fits you better?',
    loLabel:'I recharge alone — solo work energizes me', loVal:true,
    hiLabel:'I recharge with people — collaboration energizes me', hiVal:false },
  { axis:'N', text:'When processing new information, I tend to…',
    loLabel:'I go by concrete facts and direct experience', loVal:false,
    hiLabel:'I focus on patterns, ideas, and possibilities', hiVal:true },
  { axis:'T', text:'When making decisions, I tend to…',
    loLabel:'I decide with logic and data', loVal:true,
    hiLabel:'I decide with values and people in mind', hiVal:false },
  { axis:'J', text:'When working on a project, I prefer to…',
    loLabel:'I prefer to stay flexible and go with the flow', loVal:false,
    hiLabel:'I prefer to plan ahead and work systematically', hiVal:true },
];

// 十二時辰 — 12 two-hour periods (Shichen)
// The hour pillar only depends on which Shichen you're in, not the exact minute
const SHICHEN = [
  { branch:0,  label:'子 Zǐ  (Rat)',     en:'Rat Hour',     range:'11 PM – 1 AM',  start:23 },
  { branch:1,  label:'丑 Chǒu (Ox)',     en:'Ox Hour',      range:'1 AM – 3 AM',   start:1  },
  { branch:2,  label:'寅 Yín  (Tiger)',  en:'Tiger Hour',   range:'3 AM – 5 AM',   start:3  },
  { branch:3,  label:'卯 Mǎo  (Rabbit)', en:'Rabbit Hour',  range:'5 AM – 7 AM',   start:5  },
  { branch:4,  label:'辰 Chén (Dragon)', en:'Dragon Hour',  range:'7 AM – 9 AM',   start:7  },
  { branch:5,  label:'巳 Sì   (Snake)',  en:'Snake Hour',   range:'9 AM – 11 AM',  start:9  },
  { branch:6,  label:'午 Wǔ   (Horse)',  en:'Horse Hour',   range:'11 AM – 1 PM',  start:11 },
  { branch:7,  label:'未 Wèi  (Goat)',   en:'Goat Hour',    range:'1 PM – 3 PM',   start:13 },
  { branch:8,  label:'申 Shēn (Monkey)', en:'Monkey Hour',  range:'3 PM – 5 PM',   start:15 },
  { branch:9,  label:'酉 Yǒu  (Rooster)',en:'Rooster Hour', range:'5 PM – 7 PM',   start:17 },
  { branch:10, label:'戌 Xū   (Dog)',    en:'Dog Hour',     range:'7 PM – 9 PM',   start:19 },
  { branch:11, label:'亥 Hài  (Pig)',    en:'Pig Hour',     range:'9 PM – 11 PM',  start:21 },
];

// Timezone regions for the new UX flow
const TZ_REGIONS = [
  {
    label: 'United States',
    zones: [
      { tz:'America/New_York',    label:'Eastern (ET)',     cities:['New York','Boston','Miami','Atlanta','Washington DC','Philadelphia','Charlotte'] },
      { tz:'America/Chicago',     label:'Central (CT)',     cities:['Chicago','Houston','Dallas','Minneapolis','New Orleans','Nashville','Memphis'] },
      { tz:'America/Denver',      label:'Mountain (MT)',    cities:['Denver','Salt Lake City','Albuquerque','Boise','Tucson'] },
      { tz:'America/Los_Angeles', label:'Pacific (PT)',     cities:['Los Angeles','San Francisco','Seattle','Portland','San Diego','Las Vegas','Sacramento'] },
      { tz:'America/Phoenix',     label:'Arizona (MST)',    cities:['Phoenix','Tucson','Scottsdale','Mesa'] },
      { tz:'America/Anchorage',   label:'Alaska (AKT)',     cities:['Anchorage','Fairbanks','Juneau'] },
      { tz:'Pacific/Honolulu',    label:'Hawaii (HST)',     cities:['Honolulu','Maui','Kauai'] },
    ]
  },
  {
    label: 'Canada',
    zones: [
      { tz:'America/Toronto',     label:'Eastern',         cities:['Toronto','Ottawa','Montreal','Quebec City'] },
      { tz:'America/Winnipeg',    label:'Central',         cities:['Winnipeg','Regina','Saskatoon'] },
      { tz:'America/Edmonton',    label:'Mountain',        cities:['Calgary','Edmonton'] },
      { tz:'America/Vancouver',   label:'Pacific',         cities:['Vancouver','Victoria'] },
    ]
  },
  {
    label: 'Korea / Japan',
    zones: [
      { tz:'Asia/Seoul',          label:'Korea (KST)',     cities:['Seoul','Busan','Incheon','Daegu','Daejeon','Gwangju'] },
      { tz:'Asia/Tokyo',          label:'Japan (JST)',     cities:['Tokyo','Osaka','Kyoto','Nagoya','Fukuoka','Sapporo'] },
    ]
  },
  {
    label: 'China / East Asia',
    zones: [
      { tz:'Asia/Shanghai',       label:'China (CST)',     cities:['Beijing','Shanghai','Guangzhou','Chengdu','Shenzhen','Wuhan'] },
      { tz:'Asia/Hong_Kong',      label:'Hong Kong',       cities:['Hong Kong'] },
      { tz:'Asia/Taipei',         label:'Taiwan',          cities:['Taipei','Taichung','Kaohsiung'] },
    ]
  },
  {
    label: 'Southeast Asia',
    zones: [
      { tz:'Asia/Singapore',      label:'Singapore (SGT)', cities:['Singapore'] },
      { tz:'Asia/Bangkok',        label:'Indochina (ICT)', cities:['Bangkok','Ho Chi Minh City','Hanoi','Phnom Penh'] },
      { tz:'Asia/Jakarta',        label:'Indonesia (WIB)', cities:['Jakarta','Surabaya','Bandung'] },
      { tz:'Asia/Manila',         label:'Philippines (PHT)',cities:['Manila','Quezon City','Cebu'] },
      { tz:'Asia/Kuala_Lumpur',   label:'Malaysia (MYT)',  cities:['Kuala Lumpur','Penang','Johor Bahru'] },
    ]
  },
  {
    label: 'South Asia / Middle East',
    zones: [
      { tz:'Asia/Kolkata',        label:'India (IST)',     cities:['Mumbai','Delhi','Bangalore','Chennai','Hyderabad','Kolkata'] },
      { tz:'Asia/Dubai',          label:'Gulf (GST)',      cities:['Dubai','Abu Dhabi','Doha','Riyadh','Kuwait City'] },
      { tz:'Asia/Karachi',        label:'Pakistan (PKT)',  cities:['Karachi','Lahore','Islamabad'] },
    ]
  },
  {
    label: 'Europe',
    zones: [
      { tz:'Europe/London',       label:'UK / Ireland (GMT/BST)', cities:['London','Manchester','Dublin','Edinburgh'] },
      { tz:'Europe/Paris',        label:'Central Europe (CET)',   cities:['Paris','Berlin','Amsterdam','Rome','Madrid','Vienna','Zurich','Brussels','Stockholm','Oslo','Warsaw'] },
      { tz:'Europe/Moscow',       label:'Moscow (MSK)',           cities:['Moscow','St. Petersburg'] },
      { tz:'Europe/Istanbul',     label:'Turkey (TRT)',           cities:['Istanbul','Ankara'] },
    ]
  },
  {
    label: 'Americas (Other)',
    zones: [
      { tz:'America/Mexico_City', label:'Mexico (CST)',   cities:['Mexico City','Guadalajara','Monterrey'] },
      { tz:'America/Sao_Paulo',   label:'Brazil (BRT)',   cities:['São Paulo','Rio de Janeiro','Brasília','Salvador'] },
      { tz:'America/Argentina/Buenos_Aires', label:'Argentina', cities:['Buenos Aires','Córdoba','Rosario'] },
      { tz:'America/Bogota',      label:'Colombia (COT)', cities:['Bogotá','Medellín','Cali'] },
      { tz:'America/Lima',        label:'Peru (PET)',     cities:['Lima','Arequipa'] },
      { tz:'America/Santiago',    label:'Chile (CLT)',    cities:['Santiago','Valparaíso'] },
    ]
  },
  {
    label: 'Oceania / Africa',
    zones: [
      { tz:'Australia/Sydney',    label:'Australia East (AEST)', cities:['Sydney','Melbourne','Brisbane','Canberra'] },
      { tz:'Australia/Adelaide',  label:'Australia Central',     cities:['Adelaide','Darwin'] },
      { tz:'Australia/Perth',     label:'Australia West (AWST)', cities:['Perth'] },
      { tz:'Pacific/Auckland',    label:'New Zealand (NZST)',    cities:['Auckland','Wellington','Christchurch'] },
      { tz:'Africa/Lagos',        label:'West Africa (WAT)',     cities:['Lagos','Accra','Abuja'] },
      { tz:'Africa/Cairo',        label:'Egypt (EET)',           cities:['Cairo','Alexandria'] },
      { tz:'Africa/Nairobi',      label:'East Africa (EAT)',     cities:['Nairobi','Addis Ababa','Kampala'] },
      { tz:'Africa/Johannesburg', label:'South Africa (SAST)',   cities:['Johannesburg','Cape Town','Durban'] },
    ]
  },
];


// ─────────────────────────────────────────────
// CITIES
// ─────────────────────────────────────────────
const CITIES = [
  {c:'Seoul',n:'Korea',f:'🇰🇷',tz:'Asia/Seoul'},{c:'Busan',n:'Korea',f:'🇰🇷',tz:'Asia/Seoul'},
  {c:'Incheon',n:'Korea',f:'🇰🇷',tz:'Asia/Seoul'},{c:'Daegu',n:'Korea',f:'🇰🇷',tz:'Asia/Seoul'},
  {c:'Daejeon',n:'Korea',f:'🇰🇷',tz:'Asia/Seoul'},{c:'Gwangju',n:'Korea',f:'🇰🇷',tz:'Asia/Seoul'},
  {c:'Tokyo',n:'Japan',f:'🇯🇵',tz:'Asia/Tokyo'},{c:'Osaka',n:'Japan',f:'🇯🇵',tz:'Asia/Tokyo'},
  {c:'Kyoto',n:'Japan',f:'🇯🇵',tz:'Asia/Tokyo'},
  {c:'Beijing',n:'China',f:'🇨🇳',tz:'Asia/Shanghai'},{c:'Shanghai',n:'China',f:'🇨🇳',tz:'Asia/Shanghai'},
  {c:'Guangzhou',n:'China',f:'🇨🇳',tz:'Asia/Shanghai'},{c:'Chengdu',n:'China',f:'🇨🇳',tz:'Asia/Shanghai'},
  {c:'Hong Kong',n:'HK',f:'🇭🇰',tz:'Asia/Hong_Kong'},{c:'Taipei',n:'Taiwan',f:'🇹🇼',tz:'Asia/Taipei'},
  {c:'Singapore',n:'Singapore',f:'🇸🇬',tz:'Asia/Singapore'},
  {c:'Bangkok',n:'Thailand',f:'🇹🇭',tz:'Asia/Bangkok'},
  {c:'Jakarta',n:'Indonesia',f:'🇮🇩',tz:'Asia/Jakarta'},
  {c:'Manila',n:'Philippines',f:'🇵🇭',tz:'Asia/Manila'},
  {c:'Ho Chi Minh',n:'Vietnam',f:'🇻🇳',tz:'Asia/Ho_Chi_Minh'},
  {c:'Kuala Lumpur',n:'Malaysia',f:'🇲🇾',tz:'Asia/Kuala_Lumpur'},
  {c:'Mumbai',n:'India',f:'🇮🇳',tz:'Asia/Kolkata'},{c:'Delhi',n:'India',f:'🇮🇳',tz:'Asia/Kolkata'},
  {c:'Bangalore',n:'India',f:'🇮🇳',tz:'Asia/Kolkata'},
  {c:'Dubai',n:'UAE',f:'🇦🇪',tz:'Asia/Dubai'},
  {c:'Istanbul',n:'Turkey',f:'🇹🇷',tz:'Europe/Istanbul'},
  {c:'London',n:'UK',f:'🇬🇧',tz:'Europe/London'},
  {c:'Paris',n:'France',f:'🇫🇷',tz:'Europe/Paris'},
  {c:'Berlin',n:'Germany',f:'🇩🇪',tz:'Europe/Berlin'},
  {c:'Amsterdam',n:'Netherlands',f:'🇳🇱',tz:'Europe/Amsterdam'},
  {c:'Madrid',n:'Spain',f:'🇪🇸',tz:'Europe/Madrid'},
  {c:'Rome',n:'Italy',f:'🇮🇹',tz:'Europe/Rome'},
  {c:'Zurich',n:'Switzerland',f:'🇨🇭',tz:'Europe/Zurich'},
  {c:'Stockholm',n:'Sweden',f:'🇸🇪',tz:'Europe/Stockholm'},
  {c:'Moscow',n:'Russia',f:'🇷🇺',tz:'Europe/Moscow'},
  {c:'Sydney',n:'Australia',f:'🇦🇺',tz:'Australia/Sydney'},
  {c:'Melbourne',n:'Australia',f:'🇦🇺',tz:'Australia/Melbourne'},
  {c:'Auckland',n:'New Zealand',f:'🇳🇿',tz:'Pacific/Auckland'},
  {c:'New York',n:'USA',f:'🇺🇸',tz:'America/New_York'},
  {c:'Los Angeles',n:'USA',f:'🇺🇸',tz:'America/Los_Angeles'},
  {c:'Chicago',n:'USA',f:'🇺🇸',tz:'America/Chicago'},
  {c:'San Francisco',n:'USA',f:'🇺🇸',tz:'America/Los_Angeles'},
  {c:'Seattle',n:'USA',f:'🇺🇸',tz:'America/Los_Angeles'},
  {c:'Boston',n:'USA',f:'🇺🇸',tz:'America/New_York'},
  {c:'Miami',n:'USA',f:'🇺🇸',tz:'America/New_York'},
  {c:'Atlanta',n:'USA',f:'🇺🇸',tz:'America/New_York'},
  {c:'Denver',n:'USA',f:'🇺🇸',tz:'America/Denver'},
  {c:'Houston',n:'USA',f:'🇺🇸',tz:'America/Chicago'},
  {c:'Phoenix',n:'USA',f:'🇺🇸',tz:'America/Phoenix'},
  {c:'Honolulu',n:'USA',f:'🇺🇸',tz:'Pacific/Honolulu'},
  {c:'Toronto',n:'Canada',f:'🇨🇦',tz:'America/Toronto'},
  {c:'Vancouver',n:'Canada',f:'🇨🇦',tz:'America/Vancouver'},
  {c:'Montreal',n:'Canada',f:'🇨🇦',tz:'America/Toronto'},
  {c:'Mexico City',n:'Mexico',f:'🇲🇽',tz:'America/Mexico_City'},
  {c:'São Paulo',n:'Brazil',f:'🇧🇷',tz:'America/Sao_Paulo'},
  {c:'Buenos Aires',n:'Argentina',f:'🇦🇷',tz:'America/Argentina/Buenos_Aires'},
  {c:'Lagos',n:'Nigeria',f:'🇳🇬',tz:'Africa/Lagos'},
  {c:'Cairo',n:'Egypt',f:'🇪🇬',tz:'Africa/Cairo'},
  {c:'Nairobi',n:'Kenya',f:'🇰🇪',tz:'Africa/Nairobi'},
];

// ─────────────────────────────────────────────
// STYLESHEET
// ─────────────────────────────────────────────
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,700;1,400;1,500&family=Lato:wght@300;400;700&family=Noto+Serif+KR:wght@300;400;700&display=swap');

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

:root {
  --ow:   #F7F3EC;       /* off-white bg */
  --ow2:  #EDE8DF;       /* slightly darker panel */
  --ow3:  #E4DCCC;       /* border / subtle */
  --gold: #B8963E;       /* primary gold */
  --gold2:#D4AF5A;       /* gold highlight */
  --gold3:#7A6028;       /* dark gold */
  --ink:  #1C1710;       /* near-black text */
  --ink2: #4A3E2E;       /* warm mid */
  --ink3: #8A7A60;       /* muted text */
  --ink4: #B8A888;       /* very muted */
  --err:  #8B3A2A;
  --fp: 'Playfair Display', Georgia, serif;
  --fs: 'Lato', sans-serif;
  --fk: 'Noto Serif KR', serif;
  --r: 2px;
}

html, body, #root {
  background: var(--ow) !important;
  color: var(--ink);
  font-family: var(--fs);
  min-height: 100vh;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

/* ── TOPBAR ── */
.topbar {
  background: var(--ow);
  border-bottom: 1px solid var(--ow3);
  padding: 0 40px;
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: sticky;
  top: 0;
  z-index: 100;
}

.logo-wrap {
  display: flex; align-items: center; gap: 13px;
  cursor: pointer; text-decoration: none;
}

/* Gat SVG badge */
.gat-badge {
  width: 40px; height: 40px;
  border: 1.5px solid var(--gold);
  border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  background: var(--ow2);
  flex-shrink: 0;
  transition: background .2s;
}
.logo-wrap:hover .gat-badge { background: var(--ow3); }

.logo-text-wrap { display: flex; flex-direction: column; }
.logo-title {
  font-family: var(--fp);
  font-size: 22px; font-weight: 700;
  color: var(--ink); letter-spacing: .06em;
  line-height: 1;
}
.logo-sub {
  font-size: 9px; letter-spacing: .22em; text-transform: uppercase;
  color: var(--gold); margin-top: 3px;
}

.nav-links { display: flex; gap: 32px; }
.nav-btn {
  font-family: var(--fs);
  font-size: 11px; letter-spacing: .14em; text-transform: uppercase;
  color: var(--ink3);
  background: none; border: none;
  cursor: pointer; padding: 4px 0;
  border-bottom: 1px solid transparent;
  transition: color .18s, border-color .18s;
}
.nav-btn:hover { color: var(--ink); }
.nav-btn.on { color: var(--gold3); border-color: var(--gold); }

/* ── LAYOUT ── */
.page { min-height: calc(100vh - 64px); }

/* ── FORM PAGE ── */
.form-wrap {
  max-width: 520px;
  margin: 0 auto;
  padding: 56px 32px 100px;
}

.form-kicker {
  font-size: 10px; letter-spacing: .26em; text-transform: uppercase;
  color: var(--gold); margin-bottom: 12px;
  display: flex; align-items: center; gap: 10px;
}
.form-kicker::after { content:''; flex:1; height:1px; background: var(--gold); opacity:.35; }

.form-h1 {
  font-family: var(--fp);
  font-size: 38px; font-weight: 400; line-height: 1.15;
  color: var(--ink); letter-spacing: -.01em;
  margin-bottom: 10px;
}
.form-h1 em { font-style: italic; color: var(--gold3); }

.form-lead {
  font-size: 14px; color: var(--ink3); line-height: 1.7;
  margin-bottom: 44px; font-weight: 300;
}

/* Section separator */
.sep {
  display: flex; align-items: center; gap: 14px;
  margin: 32px 0 20px;
}
.sep-label {
  font-size: 9px; letter-spacing: .22em; text-transform: uppercase;
  color: var(--ink3); white-space: nowrap; flex-shrink: 0;
}
.sep-line { flex: 1; height: 1px; background: var(--ow3); }

/* Fields */
.fg { margin-bottom: 16px; }
.fg label {
  display: block; font-size: 11px; letter-spacing: .1em; text-transform: uppercase;
  font-weight: 700; color: var(--ink2); margin-bottom: 7px;
}
.fg input, .fg select {
  width: 100%; padding: 11px 14px;
  background: var(--ow) !important;
  border: 1px solid var(--ow3) !important;
  border-radius: var(--r);
  color: var(--ink) !important;
  font-family: var(--fs); font-size: 15px;
  outline: none;
  transition: border-color .18s, box-shadow .18s;
  -webkit-appearance: none; appearance: none;
}
.fg input:focus, .fg select:focus {
  border-color: var(--gold) !important;
  box-shadow: 0 0 0 3px rgba(184,150,62,.12) !important;
}
.fg input::placeholder { color: var(--ink4); }
.fg select option { background: var(--ow); color: var(--ink); }
.r2 { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
.r3 { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 10px; }

/* Checkbox */
.cbrow {
  display: flex; align-items: center; gap: 9px;
  margin-top: 10px; cursor: pointer;
}
.cbrow input[type=checkbox] { width: 16px; height: 16px; accent-color: var(--gold); cursor: pointer; }
.cbrow span { font-size: 13px; color: var(--ink3); font-weight: 300; }

/* Autocomplete */
.ac { position: relative; }
.ac-dd {
  position: absolute; top: 100%; left: 0; right: 0; z-index: 400;
  background: var(--ow);
  border: 1px solid var(--gold);
  border-top: none;
  border-radius: 0 0 var(--r) var(--r);
  max-height: 220px; overflow-y: auto;
  box-shadow: 0 12px 32px rgba(28,23,16,.1);
}
.ac-row {
  display: flex; align-items: center; gap: 10px;
  padding: 9px 14px; cursor: pointer;
  font-size: 14px; color: var(--ink2);
  border-bottom: 1px solid var(--ow3);
  transition: background .1s;
}
.ac-row:last-child { border-bottom: none; }
.ac-row:hover { background: var(--ow2); }
.ac-info { margin-left: auto; font-size: 11px; color: var(--ink4); letter-spacing: .04em; }

/* Questions */
.q-block {
  margin-bottom: 20px;
  border: 1px solid var(--ow3);
  border-radius: var(--r);
  background: var(--ow);
  overflow: hidden;
  transition: border-color .2s;
}
.q-block.answered { border-color: var(--gold); }

.q-head {
  padding: 16px 18px 12px;
  border-bottom: 1px solid var(--ow3);
  background: var(--ow2);
}
.q-num {
  font-size: 9px; letter-spacing: .2em; text-transform: uppercase;
  color: var(--gold); margin-bottom: 6px;
}
.q-text {
  font-family: var(--fp); font-style: italic;
  font-size: 16px; line-height: 1.5; color: var(--ink);
}

.q-body { padding: 14px 18px 16px; }
.q-row { display: flex; align-items: center; gap: 10px; }
.q-pole { font-size: 11px; color: var(--ink4); flex: 1; line-height: 1.3; }
.q-pole.r { text-align: right; }
.q-btns { display: flex; gap: 6px; }
.q-btn {
  width: 38px; height: 38px;
  border: 1px solid var(--ow3);
  border-radius: var(--r);
  background: var(--ow2);
  color: var(--ink3); font-size: 13px;
  font-family: var(--fs);
  cursor: pointer;
  transition: all .14s;
  display: flex; align-items: center; justify-content: center;
}
.q-btn:hover { border-color: var(--gold2); color: var(--ink); }
.q-btn.s {
  background: var(--gold); border-color: var(--gold);
  color: var(--ow); font-weight: 700;
}

/* Submit */
.cta-wrap { margin-top: 36px; }
.cta-btn {
  width: 100%; padding: 16px;
  background: var(--ink); color: var(--ow);
  font-family: var(--fs); font-size: 13px; font-weight: 700;
  letter-spacing: .14em; text-transform: uppercase;
  border: none; border-radius: var(--r);
  cursor: pointer; transition: background .18s;
}
.cta-btn:hover:not(:disabled) { background: var(--gold3); }
.cta-btn:disabled { opacity: .3; cursor: not-allowed; }
.cta-note {
  font-size: 11px; color: var(--ink4); letter-spacing: .06em;
  text-align: center; margin-top: 10px;
}

/* ── LOADING ── */
.loading-pg {
  min-height: calc(100vh - 64px);
  display: flex; flex-direction: column;
  align-items: center; justify-content: center;
  gap: 20px;
}
.load-glyph {
  animation: glyph-pulse 2.2s ease-in-out infinite;
}
@keyframes glyph-pulse { 0%,100%{opacity:.5;transform:scale(.96)} 50%{opacity:1;transform:scale(1)} }

.load-progress {
  width: 160px; height: 1px;
  background: var(--ow3);
  border-radius: 1px; overflow: hidden;
}
.load-bar {
  height: 100%; background: var(--gold);
  animation: lbar 2.4s cubic-bezier(.4,0,.2,1) forwards;
}
@keyframes lbar { from{width:0} to{width:85%} }

.load-msg {
  font-family: var(--fp); font-style: italic;
  font-size: 17px; color: var(--ink2);
  animation: msg-fade 1.8s ease-in-out infinite;
  letter-spacing: .01em;
}
@keyframes msg-fade { 0%,100%{opacity:.35} 50%{opacity:1} }

.load-note { font-size: 11px; color: var(--ink4); letter-spacing: .06em; }

/* ── RESULTS ── */
.results-wrap {
  max-width: 600px; margin: 0 auto;
  padding: 52px 32px 100px;
}

.res-back {
  font-size: 11px; letter-spacing: .12em; text-transform: uppercase;
  color: var(--ink3); background: none; border: none;
  cursor: pointer; font-family: var(--fs);
  display: flex; align-items: center; gap: 7px;
  margin-bottom: 32px; padding: 0;
  transition: color .2s;
}
.res-back:hover { color: var(--gold3); }

.res-eyebrow {
  font-size: 10px; letter-spacing: .24em; text-transform: uppercase;
  color: var(--gold); margin-bottom: 10px;
  display: flex; align-items: center; gap: 10px;
}
.res-eyebrow::after { content:''; flex:1; height:1px; background:var(--gold); opacity:.3; }

.res-h1 {
  font-family: var(--fp); font-size: 34px; font-weight: 400;
  line-height: 1.15; color: var(--ink); margin-bottom: 8px;
}
.res-meta { font-size: 13px; color: var(--ink3); margin-bottom: 40px; font-weight: 300; }

/* Result panels */
.rpanel {
  margin-bottom: 14px;
  border: 1px solid var(--ow3);
  border-radius: var(--r);
  overflow: hidden;
}
.rpanel-head {
  padding: 11px 20px;
  background: var(--ow2);
  border-bottom: 1px solid var(--ow3);
  display: flex; align-items: center; justify-content: space-between;
}
.rpanel-label {
  font-size: 9px; letter-spacing: .2em; text-transform: uppercase; color: var(--ink3);
}
.rpanel-body { padding: 22px 22px; background: var(--ow); }

/* Archetype block */
.arc-block {
  padding: 20px 22px;
  border-radius: var(--r);
  border: 1px solid var(--ow3);
  margin-bottom: 12px;
}
.arc-block.primary { background: var(--ow2); border-color: var(--gold); border-left-width: 3px; }
.arc-block.secondary { background: var(--ow); }

.arc-rank { font-size: 9px; letter-spacing: .16em; text-transform: uppercase; color: var(--ink3); margin-bottom: 6px; }
.arc-name {
  font-family: var(--fp); font-size: 24px; font-weight: 500;
  color: var(--ink); margin-bottom: 8px; line-height: 1.1;
}
.arc-name .arc-icon { color: var(--gold); margin-right: 8px; }
.arc-tagline {
  font-family: var(--fp); font-style: italic; font-size: 14px;
  color: var(--gold3); margin-bottom: 12px; line-height: 1.4;
}
.arc-desc { font-size: 14px; color: var(--ink2); line-height: 1.7; margin-bottom: 14px; }

.arc-dl { display: flex; flex-direction: column; gap: 10px; }
.arc-dt {
  font-size: 9px; letter-spacing: .14em; text-transform: uppercase;
  color: var(--ink3); margin-bottom: 2px;
}
.arc-dd { font-size: 13px; color: var(--ink2); line-height: 1.6; }
.arc-dd.stress { color: var(--err); }

/* Pillars */
.pillars-row { display: flex; gap: 8px; margin-bottom: 18px; }
.pcol {
  flex: 1; background: var(--ow2);
  border: 1px solid var(--ow3);
  border-radius: var(--r);
  padding: 16px 6px 14px; text-align: center;
}
.pcol-lbl {
  font-size: 8px; letter-spacing: .16em; text-transform: uppercase;
  color: var(--ink4); margin-bottom: 12px;
  display: flex; flex-direction: column; align-items: center; gap: 1px;
}
.pcol-lbl .lbl-kr { font-family: var(--fk); font-size: 11px; letter-spacing: 0; text-transform: none; color: var(--ink3); font-weight: 400; }
.pcol-lbl .lbl-en { font-size: 8px; letter-spacing: .14em; color: var(--ink4); }

/* separator between stem and branch */
.pcol-mid { width: 24px; height: 1px; background: var(--ow3); margin: 10px auto; }

.pcol-stem   { font-family: var(--fk); font-size: 28px; line-height: 1; margin-bottom: 4px; }
.pcol-kor    { font-size: 14px; font-weight: 700; line-height: 1; margin-bottom: 1px; }
.pcol-rom    { font-size: 10px; color: var(--ink4); letter-spacing: .04em; margin-bottom: 0; }
.pcol-branch { font-family: var(--fk); font-size: 22px; line-height: 1; margin-bottom: 4px; }
/* reuse .pcol-kor and .pcol-rom for branch too */

/* Element bars */
.el-list { display: flex; flex-direction: column; gap: 8px; }
.el-row  { display: flex; align-items: center; gap: 10px; }
.el-name { font-size: 11px; color: var(--ink3); width: 62px; text-align: right; flex-shrink: 0; line-height: 1.3; }
.el-track { flex: 1; height: 4px; background: var(--ow3); border-radius: 2px; overflow: hidden; }
.el-fill  { height: 100%; border-radius: 2px; transition: width .8s ease; }
.el-pct  { font-size: 11px; color: var(--ink4); width: 32px; text-align: right; flex-shrink: 0; }

/* DM badge */
.dm-badge {
  display: inline-flex; align-items: center; gap: 14px;
  padding: 11px 18px;
  background: var(--ow2); border: 1px solid var(--gold);
  border-radius: var(--r); margin-bottom: 20px;
}
.dm-char  { font-family: var(--fk); font-size: 32px; line-height: 1; color: var(--gold3); }
.dm-info  { display: flex; flex-direction: column; gap: 2px; }
.dm-lbl   { font-size: 9px; letter-spacing: .14em; text-transform: uppercase; color: var(--ink3); }
.dm-val   { font-size: 14px; font-weight: 700; color: var(--ink); }

/* Stress callout */
.stress-box {
  padding: 14px 18px;
  background: var(--ow2);
  border-left: 3px solid var(--gold);
  border-radius: 0 var(--r) var(--r) 0;
  margin-bottom: 14px;
}
.stress-lbl { font-size: 9px; letter-spacing: .16em; text-transform: uppercase; color: var(--gold3); margin-bottom: 4px; }
.stress-txt { font-size: 13px; color: var(--ink2); line-height: 1.65; }

/* Input summary chips */
.input-chip {
  display: inline-flex; flex-direction: column; gap: 2px;
  padding: 9px 14px;
  background: var(--ow2); border: 1px solid var(--ow3);
  border-radius: var(--r);
}
.chip-lbl { font-size: 9px; letter-spacing: .14em; text-transform: uppercase; color: var(--ink3); }
.chip-val { font-size: 13px; font-weight: 500; color: var(--ink); }

/* Calc bars */
.calc-bar { flex: 1; min-width: 140px; }
.calc-bar-lbl { font-size: 12px; color: var(--ink2); }

/* MBTI axis chips */
.axis-chip {
  display: inline-block;
  padding: 4px 10px;
  background: var(--ow3); border: 1px solid var(--border2, var(--ow3));
  border-radius: 20px; font-size: 12px; color: var(--ink2);
  font-weight: 500;
}


/* ── SHICHEN GRID ── */

/* ── GENDER SELECTOR ── */
.gender-row { display: flex; gap: 10px; margin-bottom: 6px; }
.gender-btn {
  flex: 1; padding: 11px 16px; background: var(--ow2);
  border: 1px solid var(--ow3); border-radius: var(--r);
  font-size: 13px; font-weight: 600; color: var(--ink3);
  cursor: pointer; transition: all .15s; letter-spacing: .01em;
}
.gender-btn:hover { border-color: var(--gold2); color: var(--ink); }
.gender-btn.selected {
  background: var(--gold); border-color: var(--gold);
  color: #fff;
}

.shichen-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
  margin-bottom: 12px;
}
.shichen-btn {
  display: flex; flex-direction: column; align-items: center;
  padding: 10px 6px;
  background: var(--ow2); border: 1px solid var(--ow3);
  border-radius: var(--r); cursor: pointer;
  transition: all .15s; gap: 2px;
  font-family: var(--fs);
}
.shichen-btn:hover { border-color: var(--gold2); background: var(--ow); }
.shichen-btn.selected {
  background: var(--gold); border-color: var(--gold);
}
.shichen-btn.selected .sc-char,
.shichen-btn.selected .sc-en,
.shichen-btn.selected .sc-range { color: var(--ow); }
.sc-char  { font-family: var(--fk); font-size: 17px; color: var(--ink); font-weight: 700; }
.sc-en    { font-size: 11px; font-weight: 600; color: var(--ink2); letter-spacing: .02em; }
.sc-range { font-size: 9px; color: var(--ink3); letter-spacing: .01em; }




/* ── ACCORDION ROLES ── */
.role-tier-acc { margin-bottom: 8px; border: 1px solid var(--ow3); border-radius: var(--r); overflow: hidden; }
.role-tier-header { display: flex; align-items: center; justify-content: space-between; padding: 10px 14px; cursor: pointer; background: var(--ow2); transition: background .15s; }
.role-tier-header:hover { background: var(--ow3); }
.role-tier-label { font-size: 10px; font-weight: 700; letter-spacing: .12em; text-transform: uppercase; color: var(--ink3); }
.role-tier-toggle { font-size: 11px; color: var(--gold3); font-weight: 600; }
.role-preview { padding: 8px 14px 10px; display: flex; align-items: center; gap: 6px; }
.role-preview-title { font-size: 12px; color: var(--ink2); }
.role-preview-more { font-size: 11px; color: var(--ink4); }
.show-more-btn { background: none; border: none; color: var(--gold3); font-size: 11px; font-weight: 600; cursor: pointer; padding: 6px 0 2px; letter-spacing: .04em; }
.show-more-btn:hover { color: var(--gold); }

/* ── TIMING CTA ── */
.timing-cta-wrap { margin: 0 0 24px; padding: 20px 22px; background: var(--ow2); border: 1px solid var(--ow3); border-top: 2px solid var(--gold); border-radius: var(--r); }
.timing-cta-eyebrow { font-size: 9px; letter-spacing: .18em; text-transform: uppercase; color: var(--gold3); font-weight: 700; margin-bottom: 8px; }
.timing-cta-desc { font-size: 13px; color: var(--ink2); line-height: 1.65; margin-bottom: 16px; }
.timing-cta-btn { background: var(--gold); color: #fff; border: none; border-radius: 6px; padding: 10px 20px; font-size: 13px; font-weight: 700; cursor: pointer; letter-spacing: .03em; transition: opacity .15s; }
.timing-cta-btn:hover { opacity: .88; }

/* ── TIMING PAGE ── */
.timing-page { max-width: 640px; margin: 0 auto; padding: 20px 16px 60px; }
.timing-page-eyebrow { font-size: 9px; letter-spacing: .2em; text-transform: uppercase; color: var(--gold3); font-weight: 700; margin-bottom: 10px; }
.timing-page-h1 { font-size: 36px; font-weight: 800; color: var(--ink); margin: 0 0 24px; letter-spacing: -.02em; }

/* Decade context block */
.tp-decade-wrap { padding: 18px 20px; background: var(--ow2); border: 1px solid var(--ow3); border-radius: var(--r); margin-bottom: 16px; }
.tp-decade-header { display: flex; align-items: flex-start; justify-content: space-between; gap: 12px; margin-bottom: 12px; flex-wrap: wrap; }
.tp-decade-left { display: flex; align-items: center; gap: 12px; }
.tp-decade-chars { font-family: var(--fk); font-size: 30px; line-height: 1; display: flex; gap: 2px; }
.tp-decade-inf { font-size: 13px; font-weight: 700; color: var(--ink); margin-bottom: 2px; }
.tp-decade-theme { font-size: 10px; letter-spacing: .1em; text-transform: uppercase; color: var(--ink4); }
.tp-decade-range { text-align: right; }
.tp-decade-ages { font-size: 13px; font-weight: 600; color: var(--ink2); }
.tp-decade-years { font-size: 11px; color: var(--ink4); }
.tp-decade-body { font-size: 13px; color: var(--ink2); line-height: 1.7; margin: 0; }

/* NOW focus block — the main event */
.tp-now-wrap { padding: 20px 22px; background: var(--ow); border: 1px solid var(--ow3); border-top: 2px solid var(--gold); border-radius: var(--r); margin-bottom: 16px; }
.tp-now-eyebrow { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; margin-bottom: 14px; }
.tp-now-badge { background: var(--gold); color: #fff; font-size: 9px; font-weight: 800; letter-spacing: .14em; padding: 3px 8px; border-radius: 4px; }
.tp-now-year { font-size: 11px; color: var(--ink4); font-family: var(--fk); }
.tp-now-inf-badge { font-size: 10px; font-weight: 700; letter-spacing: .06em; padding: 3px 9px; border-radius: 20px; border: 1px solid; }
.tp-now-headline { font-size: 17px; font-weight: 800; color: var(--ink); margin-bottom: 10px; letter-spacing: -.01em; }
.tp-now-body { font-size: 13px; color: var(--ink2); line-height: 1.75; margin-bottom: 18px; }

/* Action items */
.tp-actions-wrap { border-top: 1px solid var(--ow3); padding-top: 14px; }
.tp-actions-label { font-size: 9px; letter-spacing: .16em; text-transform: uppercase; color: var(--gold3); font-weight: 700; margin-bottom: 10px; }
.tp-action-row { display: flex; align-items: flex-start; gap: 12px; margin-bottom: 10px; }
.tp-action-row:last-child { margin-bottom: 0; }
.tp-action-num { flex-shrink: 0; width: 22px; height: 22px; border-radius: 50%; background: var(--gold3)22; color: var(--gold3); font-size: 11px; font-weight: 800; display: flex; align-items: center; justify-content: center; margin-top: 1px; }
.tp-action-text { font-size: 13px; color: var(--ink); line-height: 1.6; font-weight: 500; }

/* Next decade preview */
.tp-next-wrap { padding: 16px 18px; background: var(--ow2); border: 1px solid var(--ow3); border-radius: var(--r); margin-bottom: 16px; opacity: .85; }
.tp-next-label { font-size: 9px; letter-spacing: .16em; text-transform: uppercase; color: var(--ink4); font-weight: 700; margin-bottom: 10px; }
.tp-next-header { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; margin-bottom: 10px; }
.tp-next-chars { font-family: var(--fk); font-size: 22px; display: flex; gap: 2px; }
.tp-next-inf { font-size: 11px; font-weight: 600; }
.tp-next-age { font-size: 11px; color: var(--ink4); margin-left: auto; }
.tp-next-body { font-size: 12.5px; color: var(--ink3); line-height: 1.7; margin-bottom: 10px; }
.tp-next-hint { font-size: 11px; color: var(--ink4); font-style: italic; border-top: 1px solid var(--ow3); padding-top: 8px; }

/* Timeline toggle */
.tp-tl-toggle-wrap { margin-bottom: 8px; }
.tp-tl-toggle-btn { background: none; border: 1px solid var(--ow3); border-radius: var(--r); color: var(--ink3); font-size: 12px; font-weight: 600; padding: 8px 14px; cursor: pointer; width: 100%; text-align: center; transition: all .15s; }
.tp-tl-toggle-btn:hover { border-color: var(--gold2); color: var(--gold3); }

/* Timeline accordion */
.tp-timeline { border: 1px solid var(--ow3); border-radius: var(--r); overflow: hidden; margin-bottom: 16px; }
.tp-tl-row { border-bottom: 1px solid var(--ow3); }
.tp-tl-row:last-child { border-bottom: none; }
.tp-tl-row.current { background: var(--gold3)0a; }
.tp-tl-summary { display: flex; align-items: center; justify-content: space-between; padding: 11px 14px; cursor: pointer; transition: background .12s; }
.tp-tl-summary:hover { background: var(--ow3); }
.tp-tl-left { display: flex; align-items: center; gap: 8px; }
.tp-tl-char { font-family: var(--fk); font-size: 18px; line-height: 1; }
.tp-tl-inf { font-size: 11px; font-weight: 600; }
.tp-tl-now { font-size: 9px; font-weight: 800; letter-spacing: .1em; color: var(--gold3); background: var(--gold3)22; padding: 2px 7px; border-radius: 10px; }
.tp-tl-right { display: flex; align-items: center; gap: 10px; }
.tp-tl-age { font-size: 12px; color: var(--ink); font-weight: 600; }
.tp-tl-year { font-size: 10px; color: var(--ink4); }
.tp-tl-toggle { font-size: 14px; color: var(--gold3); width: 18px; text-align: center; }
.tp-tl-detail { padding: 4px 14px 14px 14px; }
.tp-tl-theme { font-size: 10px; letter-spacing: .12em; text-transform: uppercase; color: var(--ink4); margin-bottom: 6px; }
.tp-tl-body { font-size: 12px; color: var(--ink2); line-height: 1.65; }

/* Method note *//* Method note */
.tp-method-note { margin-top: 24px; padding: 16px 18px; background: var(--ow2); border: 1px solid var(--ow3); border-radius: var(--r); }
.tp-method-label { font-size: 9px; letter-spacing: .16em; text-transform: uppercase; color: var(--gold3); font-weight: 700; margin-bottom: 8px; }
.tp-method-note p { font-size: 11px; color: var(--ink4); line-height: 1.7; }

/* ── DAILY ENERGY CARD ── */
.daily-energy-card {
  background: var(--ow2);
  border: 1px solid var(--ow3);
  border-left: 3px solid var(--gold);
  border-radius: var(--r);
  padding: 16px 18px;
}
.de-header {
  display: flex; align-items: center; justify-content: space-between;
  margin-bottom: 10px; flex-wrap: wrap; gap: 8px;
}
.de-date { font-size: 11px; color: var(--ink4); letter-spacing: .05em; }
.de-badge {
  font-size: 9px; letter-spacing: .12em; text-transform: uppercase;
  font-weight: 700; padding: 3px 9px; border-radius: 20px;
}
.de-wuxing {
  display: flex; align-items: center; gap: 7px;
  margin-bottom: 12px; flex-wrap: wrap;
}
.de-stem {
  font-family: var(--fk); font-size: 20px; color: var(--gold3); line-height: 1;
}
.de-stem-rom { font-size: 12px; color: var(--ink3); }
.de-dot { color: var(--ink4); }
.de-el { font-size: 12px; font-weight: 700; }
.de-rel-label { font-size: 11px; color: var(--ink4); font-style: italic; }
.de-theme {
  font-size: 13px; font-weight: 700; color: var(--ink);
  margin-bottom: 6px; letter-spacing: .01em;
}
.de-focus {
  font-size: 13px; color: var(--ink2); line-height: 1.65;
  margin-bottom: 10px;
}
.de-caution {
  font-size: 12px; color: var(--ink3); line-height: 1.6;
  padding: 8px 12px; background: var(--ow3);
  border-radius: calc(var(--r) - 2px); margin-bottom: 12px;
}
.de-caution-label { font-weight: 700; color: var(--ink2); }
.de-action-row {
  border-top: 1px solid var(--ow3); padding-top: 12px;
}
.de-action-label {
  font-size: 9px; letter-spacing: .16em; text-transform: uppercase;
  color: var(--gold3); font-weight: 700; margin-bottom: 6px;
}
.de-action-text {
  font-size: 13px; color: var(--ink); line-height: 1.65; font-weight: 500;
}


/* ── SEASONAL MODIFIER CARD ── */
.seasonal-card {
  margin-top: 16px;
  padding: 16px 18px;
  background: var(--ow2);
  border: 1px solid var(--ow3);
  border-radius: var(--r);
  border-top: 2px solid var(--gold2);
}
.seasonal-header {
  display: flex; align-items: flex-start; justify-content: space-between;
  flex-wrap: wrap; gap: 8px; margin-bottom: 12px;
}
.seasonal-badge {
  display: inline-flex; align-items: center; gap: 6px;
  font-size: 10px; font-weight: 700; letter-spacing: .12em;
  text-transform: uppercase; padding: 4px 10px;
  border-radius: 20px; border: 1px solid;
}
.seasonal-cn { font-family: var(--fk); font-size: 13px; letter-spacing: 0; }
.seasonal-sep { opacity: .4; }
.seasonal-meta { font-size: 11px; color: var(--ink4); text-align: right; line-height: 1.5; }
.seasonal-style {
  font-size: 14px; font-weight: 700; color: var(--ink);
  margin-bottom: 6px; letter-spacing: .01em;
}
.seasonal-insight {
  font-size: 13px; color: var(--ink2); line-height: 1.65; margin-bottom: 12px;
}
.seasonal-rows { display: flex; flex-direction: column; gap: 0; }
.seasonal-row {
  padding: 9px 0; border-top: 1px solid var(--ow3);
  display: grid; grid-template-columns: 90px 1fr; gap: 12px;
}
.seasonal-row-label {
  font-size: 9px; font-weight: 700; letter-spacing: .15em;
  text-transform: uppercase; color: var(--gold3); padding-top: 2px;
}
.seasonal-row-text { font-size: 12px; color: var(--ink2); line-height: 1.6; }

/* ── CAREER COACHING PANELS ── */
.coach-section {
  margin-top: 22px;
  padding-top: 18px;
  border-top: 1px solid var(--ow3);
}
.coach-sec-label {
  font-size: 9px; letter-spacing: .18em; text-transform: uppercase;
  color: var(--gold3); margin-bottom: 12px; font-weight: 700;
}

/* Roles */
/* ── TIERED ROLES ── */
.role-tier { margin-bottom: 18px; }
.role-tier-label {
  font-size: 9px; letter-spacing: .15em; text-transform: uppercase;
  color: var(--ink4); font-weight: 700; margin-bottom: 8px;
  padding: 4px 0; border-bottom: 1px solid var(--ow3);
}
.role-card {
  padding: 12px 14px; margin-bottom: 8px;
  background: var(--ow); border: 1px solid var(--ow3); border-radius: var(--r);
}
.role-title { font-size: 14px; font-weight: 700; color: var(--ink); margin-bottom: 4px; }
.role-why   { font-size: 12px; color: var(--ink2); line-height: 1.55; margin-bottom: 5px; }
.role-path  { font-size: 11px; color: var(--ink4); line-height: 1.5; font-style: italic; }

/* ── INDUSTRY FIT BARS ── */
.industry-list { display: flex; flex-direction: column; gap: 0; margin-top: 8px; }
.industry-row {
  padding: 10px 0; border-bottom: 1px solid var(--ow3);
}
.industry-meta {
  display: flex; align-items: center; justify-content: space-between;
  margin-bottom: 4px;
}
.industry-name { font-size: 13px; font-weight: 600; color: var(--ink); }
.fit-dots { display: flex; gap: 4px; align-items: center; }
.fit-dot {
  width: 8px; height: 8px; border-radius: 50%;
  background: var(--ow3); border: 1px solid var(--ow3);
  transition: background .15s;
}
.fit-dot.filled { background: var(--gold); border-color: var(--gold3); }
.industry-note { font-size: 11px; color: var(--ink3); line-height: 1.5; }

/* Seek / Avoid grid */
.seek-avoid-grid {
  display: grid; grid-template-columns: 1fr 1fr; gap: 12px;
  margin-top: 22px; padding-top: 18px; border-top: 1px solid var(--ow3);
}
@media (max-width: 500px) { .seek-avoid-grid { grid-template-columns: 1fr; } }
.seek-col {}
.seek-label {
  font-size: 9px; letter-spacing: .16em; text-transform: uppercase;
  font-weight: 700; margin-bottom: 10px;
}
.seek-label.seek  { color: #4A7C59; }
.seek-label.avoid { color: var(--err); }
.seek-item, .avoid-item {
  font-size: 12px; line-height: 1.55; color: var(--ink2);
  padding: 6px 0; border-bottom: 1px solid var(--ow3);
}
.seek-item::before  { content: '✓ '; color: #4A7C59; font-weight: 700; }
.avoid-item::before { content: '✕ '; color: var(--err); font-weight: 700; }

/* Burnout */
.burnout-box {
  background: #F9F1E8; border: 1px solid #E8D5B0;
  border-left: 3px solid #B8963E;
  border-radius: var(--r); padding: 14px 16px;
}
.burnout-recovery { font-size: 12px; color: var(--ink3); line-height: 1.6; }

/* Actions */
.action-item {
  display: flex; gap: 14px; align-items: flex-start;
  padding: 12px 0; border-bottom: 1px solid var(--ow3);
}
.action-num {
  width: 24px; height: 24px; border-radius: 50%;
  background: var(--gold); color: var(--ow);
  font-size: 11px; font-weight: 700;
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0; margin-top: 1px;
}
.action-text { font-size: 13px; color: var(--ink2); line-height: 1.65; }

/* Interview box */
.interview-box {
  background: var(--ow2); border: 1px solid var(--ow3);
  border-radius: var(--r); padding: 14px 16px;
  font-size: 13px; color: var(--ink2); line-height: 1.7;
  font-style: italic;
}

/* Strategy */
.strategy-box {
  font-size: 13px; color: var(--ink2); line-height: 1.7;
  padding: 12px 16px; background: var(--ow2);
  border-radius: var(--r); border-left: 2px solid var(--gold2);
}


/* ── ABOUT PAGE REFERENCE BOX ── */
.about-ref-box {
  background: var(--ow2); border: 1px solid var(--ow3);
  border-left: 3px solid var(--gold2);
  border-radius: var(--r); padding: 16px 18px; margin: 16px 0;
}
.about-ref-label {
  font-size: 9px; letter-spacing: .16em; text-transform: uppercase;
  color: var(--gold3); font-weight: 700; margin-bottom: 12px;
}
.about-ref-list { display: flex; flex-direction: column; gap: 0; }
.about-ref-item {
  padding: 10px 0; border-top: 1px solid var(--ow3);
  display: flex; flex-direction: column; gap: 3px;
}
.about-ref-title { font-size: 13px; font-weight: 700; color: var(--ink); }
.about-ref-desc  { font-size: 12px; color: var(--ink3); line-height: 1.55; }

/* About link in results */
.res-footer {
  margin-top: 32px; padding-top: 24px;
  border-top: 1px solid var(--ow3);
  text-align: center;
}
.res-footer p { font-size: 12px; color: var(--ink4); margin-bottom: 10px; }
.inline-link {
  font-size: 11px; letter-spacing: .12em; text-transform: uppercase;
  color: var(--ink3); background: none; border: none;
  cursor: pointer; font-family: var(--fs);
  border-bottom: 1px solid var(--ow3);
  padding-bottom: 1px; transition: color .2s, border-color .2s;
}
.inline-link:hover { color: var(--gold3); border-color: var(--gold); }

/* ── ABOUT PAGE ── */
.about-wrap {
  max-width: 660px; margin: 0 auto;
  padding: 56px 32px 100px;
}

.about-hero { margin-bottom: 60px; padding-bottom: 48px; border-bottom: 1px solid var(--ow3); }

.about-gat-lg {
  width: 72px; height: 72px;
  border: 1.5px solid var(--gold);
  border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  background: var(--ow2); margin-bottom: 22px;
}

.about-h1 {
  font-family: var(--fp); font-size: 48px; font-weight: 400;
  line-height: 1.05; color: var(--ink); letter-spacing: -.015em;
  margin-bottom: 16px;
}
.about-lead {
  font-size: 16px; color: var(--ink2); line-height: 1.8;
  font-weight: 300; max-width: 540px;
}

.about-sec { margin-bottom: 52px; }
.about-sec-h {
  font-family: var(--fp); font-size: 24px; font-weight: 500;
  color: var(--ink); margin-bottom: 16px; letter-spacing: -.01em;
  padding-bottom: 10px; border-bottom: 1px solid var(--gold);
  display: flex; align-items: baseline; gap: 10px;
}
.about-sec-h .about-kr { font-family: var(--fk); font-size: 14px; color: var(--gold3); font-weight: 300; }
.about-p { font-size: 14px; color: var(--ink2); line-height: 1.85; margin-bottom: 14px; font-weight: 300; }

/* Pillar grid */
.p4-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin: 22px 0; }
.p4-card {
  padding: 16px 18px;
  background: var(--ow); border: 1px solid var(--ow3);
  border-radius: var(--r);
}
.p4-char { font-family: var(--fk); font-size: 28px; color: var(--gold3); margin-bottom: 6px; line-height: 1; }
.p4-name { font-size: 11px; letter-spacing: .1em; text-transform: uppercase; color: var(--gold); margin-bottom: 5px; }
.p4-desc { font-size: 12px; color: var(--ink3); line-height: 1.55; }

/* Element legend */
.el-legend { display: flex; flex-direction: column; gap: 10px; margin: 18px 0; }
.el-leg-row { display: flex; align-items: flex-start; gap: 12px; }
.el-dot-lg { width: 10px; height: 10px; border-radius: 50%; flex-shrink: 0; margin-top: 4px; }
.el-leg-text { display: flex; flex-direction: column; gap: 2px; }
.el-leg-name { font-size: 13px; font-weight: 700; color: var(--ink); }
.el-leg-desc { font-size: 12px; color: var(--ink3); line-height: 1.5; }

/* Privacy box */
.priv-box {
  padding: 20px 24px;
  background: var(--ow2); border: 1px solid var(--ow3);
  border-left: 3px solid var(--gold);
  border-radius: 0 var(--r) var(--r) 0;
  font-size: 13px; color: var(--ink2); line-height: 1.75; font-weight: 300;
}
.priv-box strong { color: var(--ink); font-weight: 700; }

/* FAQ */
.faq-item {
  border-bottom: 1px solid var(--ow3);
  padding: 16px 0;
}
.faq-q {
  font-size: 14px; font-weight: 400; color: var(--ink);
  cursor: pointer; display: flex; justify-content: space-between; align-items: center;
  gap: 14px; user-select: none;
}
.faq-toggle { font-size: 18px; color: var(--gold); flex-shrink: 0; line-height: 1; }
.faq-a {
  font-size: 13px; color: var(--ink2); line-height: 1.75;
  margin-top: 10px; font-weight: 300;
}

/* Footer */
.site-footer {
  text-align: center; padding: 20px;
  font-size: 11px; color: var(--ink4); letter-spacing: .08em;
  border-top: 1px solid var(--ow3); margin-top: 40px;
}

/* Animations */
.fade { animation: fade .3s ease; }
@keyframes fade { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:none} }

/* Responsive */
@media (max-width: 580px) {
  .topbar { padding: 0 20px; }
  .form-wrap, .results-wrap, .about-wrap { padding-left: 20px; padding-right: 20px; }
  .r2, .r3 { grid-template-columns: 1fr; }
  .pillars-row { flex-wrap: wrap; }
  .pillars-row .pcol { min-width: calc(50% - 4px); }
  .p4-grid { grid-template-columns: 1fr; }
  .form-h1 { font-size: 30px; }
  .about-h1 { font-size: 36px; }
}
`;

// ─────────────────────────────────────────────
// GAT SVG  (갓 silhouette)
// ─────────────────────────────────────────────
function GatSvg({ size = 22, color = '#B8963E' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" aria-hidden="true">
      {/* wide brim */}
      <ellipse cx="16" cy="23" rx="14" ry="3" stroke={color} strokeWidth="1.4" fill="none"/>
      {/* body cone */}
      <path d="M9 23 Q9.5 14 16 11 Q22.5 14 23 23" stroke={color} strokeWidth="1.4" fill="none" strokeLinecap="round"/>
      {/* top cap */}
      <ellipse cx="16" cy="11" rx="4.5" ry="1.8" stroke={color} strokeWidth="1.2" fill="none"/>
      {/* crown detail */}
      <line x1="16" y1="9.2" x2="16" y2="7" stroke={color} strokeWidth="1" strokeLinecap="round"/>
      <circle cx="16" cy="6.5" r="1" fill={color}/>
    </svg>
  );
}

// ─────────────────────────────────────────────
// ROOT
// ─────────────────────────────────────────────
export default function App() {
  const [page, setPageRaw] = useState('form');
  const setPage = (p) => { setPageRaw(p); window.scrollTo(0, 0); };
  const [form, setForm]   = useState({ yr:'', mo:'', dy:'', shichen:null, tz:'America/New_York', region:'America/New_York', mbti:'', gender:'' });
  const [mini, setMini]   = useState({});   // I/N/T/J booleans from mini-questions
  const [results, setRes] = useState(null);
  const [openFaq, setFaq] = useState(null);
  const [timingData, setTimingData] = useState(null);

  useEffect(() => {
    const el = document.createElement('style');
    el.textContent = CSS;
    document.head.appendChild(el);
    return () => document.head.removeChild(el);
  }, []);

  const up = (k, v) => setForm(p => ({ ...p, [k]: v }));

  // MBTI known → use it. Unknown → use 4 mini-q answers.
  const axes = form.mbti.length === 4
    ? parseMBTI(form.mbti)
    : (Object.keys(mini).length === 4 ? mini : null);

  const compute = useCallback(() => {
    setPage('loading');
    setTimeout(() => {
      try {
        const noHour = form.shichen === null;
        // shichen.start is the clock hour at beginning of 2-hr period
        const bazi = calcBazi(
          +form.yr, +form.mo, +form.dy,
          noHour ? null : form.shichen.start,
          0,
          form.tz, noHour
        );
        const currentAxes = form.mbti.length === 4
          ? parseMBTI(form.mbti)
          : (Object.keys(mini).length === 4 ? mini : null);
        const { top2: archetypes } = calcArchetypes(currentAxes, bazi.dm.el, bazi.monthBranch);
        const stress = stressFlag(currentAxes);
        const seasonal = bazi.monthBranch !== undefined
          ? getSeasonalProfile(bazi.dm.el, bazi.monthBranch)
          : null;
        const birthYear  = +form.yr;
        const now        = new Date();
        const currentAge = now.getFullYear() - birthYear;
        const timing     = calcTiming(bazi, birthYear, currentAge);
        setRes({ bazi, archetypes, stress, mbti: form.mbti || null, axes: currentAxes, seasonal, timing, birthYear, currentAge });
        setPage('results');
      } catch (e) {
        alert('Calculation error: ' + e.message);
        setPage('form');
      }
    }, 2400);
  }, [form, mini]);

  // Ready: birth + city + (MBTI OR all 4 mini answered)
  const mbtiDone  = form.mbti.length === 4;
  const miniDone  = Object.keys(mini).length === 4;
  const ready     = form.yr && form.mo && form.dy && form.tz && form.gender && (mbtiDone || miniDone);

  return (
    <div>
      <Topbar page={page} setPage={setPage} />
      <div className="page">
        {page === 'form'    && <FormPage form={form} up={up} mini={mini} setMini={setMini} ready={ready} mbtiDone={mbtiDone} miniDone={miniDone} compute={compute} onSetShichen={sc => up('shichen', sc)} onSetTz={tz => up('tz', tz)} gender={form.gender} onSetGender={g => up('gender', g)} />}
        {page === 'loading' && <LoadingPage />}
        {page === 'results' && results && <ResultsPage results={results} setPage={setPage} setTimingData={setTimingData} />}
        {page === 'timing'  && timingData  && <TimingPage data={timingData} setPage={setPage} />}
        {page === 'about'   && <AboutPage openFaq={openFaq} setFaq={setFaq} />}
      </div>
      <footer className="site-footer">GAT 갓 · Saju × MBTI Career Coach · Not a replacement for professional guidance</footer>
    </div>
  );
}

// ─────────────────────────────────────────────
// TOPBAR
// ─────────────────────────────────────────────
function Topbar({ page, setPage }) {
  return (
    <header className="topbar">
      <div className="logo-wrap" onClick={() => setPage('form')}>
        <div className="gat-badge"><GatSvg size={22} /></div>
        <div className="logo-text-wrap">
          <div className="logo-title">GAT</div>
          <div className="logo-sub">갓 · Career Coach</div>
        </div>
      </div>
      <nav className="nav-links">
        <button className={`nav-btn ${page !== 'about' ? 'on' : ''}`} onClick={() => setPage('form')}>Start</button>
        <button className={`nav-btn ${page === 'about' ? 'on' : ''}`} onClick={() => setPage('about')}>About</button>
      </nav>
    </header>
  );
}

// ─────────────────────────────────────────────
// FORM PAGE
// ─────────────────────────────────────────────
function FormPage({ form, up, mini, setMini, ready, mbtiDone, miniDone, compute, onSetShichen, onSetTz, gender, onSetGender }) {
  const [cityQ,   setCityQ]   = useState('');
  const [cityMatches, setCityM] = useState([]);
  const [cityOpen, setCityOpen] = useState(false);

  // ── Timezone-first city search ──
  // Get cities for current selected timezone
  const currentRegion = TZ_REGIONS.flatMap(r => r.zones).find(z => z.tz === form.tz);
  const regionCities  = currentRegion ? currentRegion.cities : [];

  const onCityType = v => {
    setCityQ(v);
    if (!v) { setCityM([]); return; }
    const lo = v.toLowerCase();
    // Search within current tz first, then all
    const inZone = regionCities.filter(name => name.toLowerCase().includes(lo));
    setCityM(inZone.slice(0, 8));
    setCityOpen(true);
  };
  const pickCity = name => {
    up('city', name);
    setCityQ(name);
    setCityM([]);
    setCityOpen(false);
  };

  const setMiniAxis = (axis, val) => setMini(p => ({ ...p, [axis]: val }));
  const miniAnswered = Object.keys(mini).length;
  const MBTI_ALL = ['INTJ','INTP','INFJ','INFP','ISTJ','ISTP','ISFJ','ISFP','ENTJ','ENTP','ENFJ','ENFP','ESTJ','ESTP','ESFJ','ESFP'];

  return (
    <div className="form-wrap fade">
      <div className="form-kicker">Saju · MBTI · Career Coach</div>
      <h1 className="form-h1">Your map,<br/>built from <em>timing.</em></h1>
      <p className="form-lead">Enter your birth details and MBTI. Done in under a minute.</p>

      {/* ── BIRTH DATE ── */}
      <div className="sep"><span className="sep-label">Birth Date</span><div className="sep-line" /></div>
      <div className="r3">
        <div className="fg"><label>Year</label>
          <input type="number" min="1920" max="2010" placeholder="1995" value={form.yr} onChange={e=>up('yr',e.target.value)} /></div>
        <div className="fg"><label>Month</label>
          <input type="number" min="1" max="12" placeholder="6" value={form.mo} onChange={e=>up('mo',e.target.value)} /></div>
        <div className="fg"><label>Day</label>
          <input type="number" min="1" max="31" placeholder="15" value={form.dy} onChange={e=>up('dy',e.target.value)} /></div>
      </div>

      {/* ── BIOLOGICAL SEX ── */}
      <div className="sep"><span className="sep-label">Biological Sex</span><div className="sep-line" /></div>
      <p style={{fontSize:13,color:'var(--ink3)',lineHeight:1.65,marginBottom:14,fontWeight:300}}>
        Used to calculate the direction of your decennial luck cycles — a core part of Four Pillars methodology.
      </p>
      <div className="gender-row">
        {[{v:'male',label:'♂  Male'},{v:'female',label:'♀  Female'}].map(opt => (
          <button key={opt.v}
            className={"gender-btn" + (gender === opt.v ? ' selected' : '')}
            onClick={() => onSetGender(opt.v)}>
            {opt.label}
          </button>
        ))}
      </div>

      {/* ── BIRTH HOUR — Shichen dropdown ── */}
      <div className="sep"><span className="sep-label">Birth Hour</span><div className="sep-line" /></div>
      <p style={{fontSize:13,color:'var(--ink3)',lineHeight:1.65,marginBottom:16,fontWeight:300}}>
        Select the 2-hour period you were born in. The exact minute doesn't matter — only the period.
      </p>
      <div className="shichen-grid">
        {SHICHEN.map(sc => (
          <button key={sc.branch}
            className={"shichen-btn" + (form.shichen?.branch === sc.branch ? ' selected' : '')}
            onClick={() => onSetShichen(sc)}>
            <span className="sc-char">{sc.label.split(' ')[0]}</span>
            <span className="sc-en">{sc.en}</span>
            <span className="sc-range">{sc.range}</span>
          </button>
        ))}
      </div>
      <label className="cbrow" style={{marginTop:10}}>
        <input type="checkbox" checked={form.shichen === null}
          onChange={e => onSetShichen(e.target.checked ? null : SHICHEN[6])} />
        <span>Birth time unknown — omit the hour pillar</span>
      </label>

      {/* ── TIMEZONE (first) then CITY ── */}
      <div className="sep"><span className="sep-label">Birth Location</span><div className="sep-line" /></div>
      <p style={{fontSize:13,color:'var(--ink3)',lineHeight:1.65,marginBottom:16,fontWeight:300}}>
        Select your timezone first, then pick the nearest major city.
      </p>

      <div className="fg" style={{marginBottom:14}}>
        <label>Timezone</label>
        <select value={form.tz} onChange={e => { onSetTz(e.target.value); setCityQ(''); up('city',''); }}>
          {TZ_REGIONS.map(region => (
            <optgroup key={region.label} label={region.label}>
              {region.zones.map(z => (
                <option key={z.tz} value={z.tz}>{z.label}</option>
              ))}
            </optgroup>
          ))}
        </select>
      </div>

      <div className="fg ac" style={{marginBottom:20}}>
        <label>Nearest city <span style={{textTransform:'none',letterSpacing:0,fontWeight:300,fontSize:10,color:'var(--ink4)'}}>— used for display only, timezone above is what matters</span></label>
        <input type="text" placeholder={regionCities.length ? `e.g. ${regionCities[0]}` : 'Type a city…'}
          value={cityQ}
          onChange={e => onCityType(e.target.value)}
          onBlur={() => setTimeout(() => setCityOpen(false), 160)}
          onFocus={() => { if (!cityQ && regionCities.length) { setCityM(regionCities.slice(0,6)); setCityOpen(true); } }} />
        {cityOpen && cityMatches.length > 0 && (
          <div className="ac-dd">
            {cityMatches.map((name, i) => (
              <div key={i} className="ac-row" onMouseDown={() => pickCity(name)}>
                <span style={{fontWeight:500}}>{name}</span>
                <span className="ac-info">{form.tz}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── MBTI ── */}
      <div className="sep"><span className="sep-label">MBTI</span><div className="sep-line" /></div>

      <div className="fg">
        <label>MBTI type <span style={{textTransform:'none',letterSpacing:0,fontWeight:300,fontSize:10,color:'var(--ink4)'}}>— select if you know it, or answer 4 quick questions below</span></label>
        <select value={form.mbti} onChange={e => up('mbti', e.target.value)}>
          <option value="">Unknown / skip</option>
          {MBTI_ALL.map(m => <option key={m} value={m}>{m}</option>)}
        </select>
      </div>

      {!mbtiDone && (
        <div>
          <p style={{fontSize:13,color:'var(--ink3)',lineHeight:1.65,marginBottom:16,fontWeight:300,marginTop:16}}>
            Don't know your MBTI? Answer these 4 quick questions instead. <strong style={{color:'var(--ink2)'}}>({miniAnswered}/4)</strong>
          </p>
          {MINI_Q.map(mq => (
            <div key={mq.axis} className={"q-block " + (mini[mq.axis] !== undefined ? 'answered' : '')}>
              <div className="q-head">
                <div className="q-num">{mq.axis} Axis</div>
                <div className="q-text">{mq.text}</div>
              </div>
              <div className="q-body">
                <div style={{display:'flex',gap:10,flexDirection:'column'}}>
                  {[{label:mq.loLabel,val:mq.loVal},{label:mq.hiLabel,val:mq.hiVal}].map(opt => (
                    <button key={String(opt.val)}
                      style={{
                        padding:'11px 16px',textAlign:'left',
                        background: mini[mq.axis]===opt.val ? 'var(--gold)' : 'var(--ow2)',
                        border: `1px solid ${mini[mq.axis]===opt.val ? 'var(--gold)' : 'var(--ow3)'}`,
                        borderRadius:'var(--r)',cursor:'pointer',
                        color: mini[mq.axis]===opt.val ? 'var(--ow)' : 'var(--ink2)',
                        fontSize:14,fontFamily:'var(--fs)',fontWeight: mini[mq.axis]===opt.val ? 700 : 400,
                        transition:'all .15s',
                      }}
                      onClick={() => setMiniAxis(mq.axis, opt.val)}
                    >{opt.label}</button>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {mbtiDone && (
        <div style={{
          display:'inline-flex',alignItems:'center',gap:10,
          padding:'10px 16px',background:'var(--ow2)',
          border:'1px solid var(--gold)',borderRadius:'var(--r)',
          marginBottom:20,marginTop:8,
        }}>
          <span style={{fontSize:18}}>✓</span>
          <div>
            <div style={{fontSize:11,letterSpacing:'.12em',textTransform:'uppercase',color:'var(--gold3)',marginBottom:2}}>MBTI selected</div>
            <div style={{fontSize:15,fontWeight:700,color:'var(--ink)'}}>{form.mbti}</div>
          </div>
          <button style={{marginLeft:'auto',background:'none',border:'none',cursor:'pointer',fontSize:12,color:'var(--ink4)',fontFamily:'var(--fs)'}}
            onClick={() => up('mbti','')}>Change</button>
        </div>
      )}

      <div className="cta-wrap">
        <button className="cta-btn" disabled={!ready} onClick={compute}>
          {ready ? 'Build my map  →' : `Fill in birth details + ${mbtiDone ? 'MBTI ✓' : `MBTI questions (${miniAnswered}/4)`}`}
        </button>
        <p className="cta-note">🔒 All computation runs locally. Nothing is stored or transmitted.</p>
      </div>
    </div>
  );
}

function LoadingPage() {
  const msgs = ['Reading solar boundaries…', 'Computing the Four Pillars…', 'Weighing the elements…', 'Matching your archetypes…', 'Preparing your report…'];
  const [i, setI] = useState(0);
  useEffect(() => { const t = setInterval(() => setI(x => Math.min(x+1, msgs.length-1)), 450); return () => clearInterval(t); }, []);
  return (
    <div className="loading-pg">
      <div className="load-glyph">
        <GatSvg size={56} color="#B8963E" />
      </div>
      <div className="load-msg">{msgs[i]}</div>
      <div className="load-progress"><div className="load-bar" /></div>
      <p className="load-note">Nothing leaves your device.</p>
    </div>
  );
}

// ─────────────────────────────────────────────
// RESULTS
// ─────────────────────────────────────────────

// ─────────────────────────────────────────────
// DAILY ENERGY SYSTEM
// 일진(日辰) × 일간(日干) → 오늘의 에너지 패턴
//
// Uses today's date to calculate the current day pillar (일진)
// then maps the relationship between user's Day Master and today's element
// into a career-focused daily energy reading.
// Fully deterministic — no API, changes every day automatically.
// ─────────────────────────────────────────────

function getTodayDayPillar() {
  const now = new Date();
  // Use same Julian Day offset as calcBazi day pillar logic
  const utc = Date.UTC(now.getFullYear(), now.getMonth(), now.getDate(), 12, 0);
  const pos = ((20 + Math.floor(utc/86400000 + 2440587.5 - 2451545)) % 60 + 60) % 60;
  const dSI = pos % 10;
  const dBI = pos % 12;
  return { si: dSI, el: STEM_EL[dSI], branch: dBI };
}

// 오행 상생상극 관계
// generates: creates, weakens, controls, feeds, resists
function getWuxingRelation(myEl, todayEl) {
  const generates = { Wood:'Fire', Fire:'Earth', Earth:'Metal', Metal:'Water', Water:'Wood' };
  const controls  = { Wood:'Earth', Fire:'Metal', Earth:'Water', Metal:'Wood', Water:'Fire' };
  const weakens   = { Wood:'Water', Fire:'Wood', Earth:'Fire', Metal:'Earth', Water:'Metal' };

  if (myEl === todayEl)             return 'same';
  if (generates[myEl] === todayEl)  return 'generates'; // 상생: 내가 생함
  if (generates[todayEl] === myEl)  return 'nourishes'; // 상생: 오늘이 나를 생함
  if (controls[myEl] === todayEl)   return 'controls';  // 상극: 내가 극함
  if (controls[todayEl] === myEl)   return 'pressures'; // 상극: 오늘이 나를 극함
  return 'same';
}

// Daily energy readings per archetype × relation
// Each entry: { theme, focus, caution, action }
const DAILY_READINGS = {
  nourishes: {
    // Today's element feeds your Day Master → high energy day
    builder:   { theme:'High-output day', focus:`Your structural thinking is sharper than usual. Complex problems that felt stuck are more tractable today.`, caution:`Don't let momentum lead to over-committing. Pick one system to build, not three.`, action:`Tackle the most complex, multi-step task on your list. This is your high-leverage window.` },
    analyst:   { theme:'Clarity day', focus:`Pattern recognition is heightened. Connections between unrelated data points are easier to spot today.`, caution:`Resist the urge to keep researching. When the insight arrives, write it down and stop.`, action:`Draft the conclusion you've been avoiding. Today your first instinct is likely correct.` },
    connector: { theme:'High-energy social day', focus:`Your read on people is unusually accurate. Conversations feel easier and more productive than normal.`, caution:`You may over-extend — say yes to too many things. Guard at least 2 hours of uninterrupted work.`, action:`Schedule the difficult conversation or outreach you've been putting off. Today is the day to initiate.` },
    creator:   { theme:'Creative peak', focus:`Aesthetic judgment is sharp and ideas are flowing. The gap between what you imagine and what you can produce is narrowest today.`, caution:`Start something — don't just plan it. Creative energy unused today cycles into restlessness.`, action:`Open a blank canvas, doc, or sketchbook and make something in the next 90 minutes. No brief needed.` },
  },
  same: {
    // Same element → stable, reliable, but potentially plateaued
    builder:   { theme:'Steady execution day', focus:`Consistent, reliable energy. No dramatic highs or lows — good for methodical progress on existing projects.`, caution:`Routine can mask stagnation. Ask: is this task moving something forward, or just maintaining it?`, action:`Pick one thing that's been "almost done" for more than a week and finish it today.` },
    analyst:   { theme:'Deep focus day', focus:`Sustained concentration comes naturally today. Long, uninterrupted thinking sessions are your asset.`, caution:`Echo chamber risk — you're most comfortable with your own frameworks today. Seek one outside perspective.`, action:`Set a 2-hour focus block with no notifications. Work on the analysis that requires the most depth.` },
    connector: { theme:'Familiar ground day', focus:`Existing relationships feel solid and low-friction. Good day for maintaining and deepening, not initiating new.`, caution:`Comfortable doesn't mean productive. Don't coast on existing rapport — bring something new to the conversation.`, action:`Reach out to one existing contact with a specific, useful piece of information or opportunity for them.` },
    creator:   { theme:'Refinement day', focus:`Your eye is critical rather than generative today — better for editing, refining, and improving existing work than starting new.`, caution:`Perfectionism risk is higher than usual. Set a "done" criteria before you start revising.`, action:`Pick your most recent completed piece and make exactly three specific improvements. Then close it.` },
  },
  generates: {
    // Your element feeds today → you're giving energy out, can feel draining
    builder:   { theme:'Teaching & delegating day', focus:`Your systems knowledge is most useful when shared today. Explaining, documenting, and mentoring come naturally.`, caution:`You may feel more tired than usual by mid-afternoon. Protect your energy — batch similar tasks.`, action:`Document a process or decision you've made recently. Write it as if handing it to someone new.` },
    analyst:   { theme:'Communication day', focus:`Your analytical depth is most valuable when translated for others today. Writing, presenting, and explaining are your leverage.`, caution:`Avoid deep solo research sessions — your energy is better directed outward. Save the rabbit holes for tomorrow.`, action:`Write a short summary of your most recent insight and share it with one relevant person.` },
    connector: { theme:'Support & facilitation day', focus:`Your energy naturally flows toward helping others today. Facilitation, mentoring, and connecting people is where you add the most value.`, caution:`Giving without receiving depletes. Notice if you're carrying more than your share of a conversation or project.`, action:`Run or participate actively in a group discussion, meeting, or brainstorm. Your role today is to draw others out.` },
    creator:   { theme:'Collaborative creation day', focus:`Your creative instincts are most valuable when shared and built on by others today. Co-creation, feedback, and creative direction are your strengths.`, caution:`Resist working in isolation — your ideas need friction and input to reach their potential today.`, action:`Share a work-in-progress with someone whose taste you respect and specifically ask: what's not working yet?` },
  },
  controls: {
    // You control today's element → strong, assertive energy
    builder:   { theme:'Decision & direction day', focus:`Decisive energy — you see problems clearly and can cut through ambiguity more easily than usual. Good day for calls you've been avoiding.`, caution:`Your directness may come across as blunt. Slow down in conversations with people who need more context.`, action:`Make the decision you've been deferring. Write down the three factors that matter most, pick, and commit.` },
    analyst:   { theme:'Sharp judgment day', focus:`Critical thinking is exceptionally clear. Your ability to spot flaws, gaps, and assumptions is at its peak.`, caution:`You may be harder on others' work than usual. Apply your critical lens to your own assumptions first.`, action:`Review a plan, proposal, or analysis — yours or someone else's — and write a specific, actionable critique.` },
    connector: { theme:'Leadership energy day', focus:`Natural authority and clarity in how you communicate. People are more receptive to your direction and framing today.`, caution:`Don't mistake receptiveness for agreement. Check that you're listening, not just leading.`, action:`Take point on something that needs direction. Volunteer to facilitate, lead, or make the call.` },
    creator:   { theme:'Bold creative day', focus:`Confidence in your aesthetic judgment is high. This is a day to make strong creative choices rather than hedged, safe ones.`, caution:`Strong taste can narrow into rigidity. Stay open to solutions that surprise you.`, action:`Make the boldest version of whatever you're working on — the one you'd normally talk yourself out of. You can always pull back.` },
  },
  pressures: {
    // Today's element controls yours → friction, resistance, challenge
    builder:   { theme:'Adaptation day', focus:`External resistance or unexpected variables are likely. Your systems are being stress-tested — this is information, not failure.`, caution:`Don't force a process that isn't working. The friction is telling you something needs to change.`, action:`Identify the single biggest blocker in your current project. Spend 30 minutes on only that — not the whole problem.` },
    analyst:   { theme:'Action-over-analysis day', focus:`The conditions for perfect information aren't coming today. Practice committing with incomplete data — a valuable skill.`, caution:`Overthinking will cost you more than a suboptimal decision today. Set a strict time limit on any research.`, action:`Pick one decision you've been deferring for lack of information. Set a 1-hour timer. Decide when it goes off.` },
    connector: { theme:'Boundaries day', focus:`You may encounter friction in relationships or communication today. Use it as a signal to clarify expectations rather than smooth things over.`, caution:`Avoid over-explaining or over-accommodating. Sometimes the clearest response is the shortest one.`, action:`Identify one situation where you've been unclear about what you need. Communicate it directly — one sentence.` },
    creator:   { theme:'Constraint day', focus:`Limitations and friction are your creative material today. The best work often comes from making something excellent within tight constraints.`, caution:`Don't wait for the right conditions. The constraint IS the condition. Work with what you have.`, action:`Set an artificial limit on your next creative task: one hour, one tool, one constraint. Make the best thing you can inside it.` },
  },
};

function getDailyEnergy(dmEl, archetype) {
  const today = getTodayDayPillar();
  const relation = getWuxingRelation(dmEl, today.el);
  const reading = DAILY_READINGS[relation]?.[archetype] || DAILY_READINGS.same[archetype];

  const relationLabels = {
    nourishes:  { label:`${today.el} feeds ${dmEl}`, badge:`Energy Received`, color:`#4A7C59` },
    same:       { label:`${today.el} resonates`, badge:`Stable Ground`, color:`#B8963E` },
    generates:  { label:`${dmEl} feeds ${today.el}`, badge:`Energy Flowing Out`, color:`#7A6A4A` },
    controls:   { label:`${dmEl} shapes ${today.el}`, badge:`Assertive Energy`, color:`#6B5B8A` },
    pressures:  { label:`${today.el} shapes ${dmEl}`, badge:`Friction & Growth`, color:`#A05C3B` },
  };

  const now = new Date();
  const dateStr = now.toLocaleDateString('en-US', { weekday:'long', month:'long', day:'numeric' });

  return {
    date: dateStr,
    todayEl: today.el,
    todayStem: STEMS[today.si],
    todayStemRom: STEM_ROM[today.si],
    relation,
    rel: relationLabels[relation],
    reading,
  };
}


// ─── Accordion helper components ───────────────────
function RoleTier({ label, roles }) {
  const [open, setOpen] = useState(false);
  const preview = roles[0];
  return (
    <div className="role-tier-acc">
      <div className="role-tier-header" onClick={() => setOpen(o => !o)}>
        <span className="role-tier-label">{label}</span>
        <span className="role-tier-toggle">{open ? '−' : `${roles.length} roles +`}</span>
      </div>
      {!open && (
        <div className="role-preview">
          <span className="role-preview-title">{preview.title}</span>
          <span className="role-preview-more">{roles.length > 1 ? ` + ${roles.length - 1} more` : ''}</span>
        </div>
      )}
      {open && roles.map((r, i) => (
        <div key={i} className="role-card">
          <div className="role-title">{r.title}</div>
          <div className="role-why">{r.why}</div>
          <div className="role-path">↳ {r.path}</div>
        </div>
      ))}
    </div>
  );
}

function IndustrySection({ top, rest }) {
  const [showAll, setShowAll] = useState(false);
  const visible = showAll ? [...top, ...rest] : top;
  return (
    <div className="coach-section">
      <div className="coach-sec-label">Industry fit</div>
      <div className="industry-list">
        {visible.map((ind, i) => (
          <div key={i} className="industry-row">
            <div className="industry-meta">
              <span className="industry-name">{ind.name}</span>
              <div className="fit-dots">
                {[1,2,3,4,5].map(n => (
                  <span key={n} className={"fit-dot" + (n <= ind.fit ? ' filled' : '')} />
                ))}
              </div>
            </div>
            <div className="industry-note">{ind.note}</div>
          </div>
        ))}
      </div>
      {rest.length > 0 && (
        <button className="show-more-btn" onClick={() => setShowAll(o => !o)}>
          {showAll ? 'Show less ↑' : `+ ${rest.length} more industries`}
        </button>
      )}
    </div>
  );
}

function ResultsPage({ results, setPage, setTimingData }) {
  const { bazi, archetypes, stress, mbti, axes, seasonal, timing, birthYear, currentAge } = results;
  const { pillars, dm, ec, tot, strong } = bazi;
  const [p1, p2] = archetypes;

  const elKor = { Wood:'Wood (木)', Fire:'Fire (火)', Earth:'Earth (土)', Metal:'Metal (金)', Water:'Water (水)' };
  const mbtiLabel = mbti || (axes ? (axes.I?'I':'E')+(axes.N?'N':'S')+(axes.T?'T':'F')+(axes.J?'J':'P') : null);
  const usedMbti  = !!mbti;

  const cols = [
    { l:'Year',  lk:'年', p: pillars.year  },
    { l:'Month', lk:'月', p: pillars.month },
    { l:'Day',   lk:'日', p: pillars.day   },
    ...(pillars.hour ? [{ l:'Hour', lk:'時', p: pillars.hour }] : []),
  ];

  return (
    <div className="results-wrap fade">
      <button className="res-back" onClick={() => setPage('form')}>← New reading</button>

      <div className="res-eyebrow">GAT · Your Report</div>
      <h1 className="res-h1">{p1.label} <span style={{color:'var(--ink3)',fontWeight:300,fontSize:'0.7em'}}>with</span> {p2.label}</h1>

      {/* Input summary chips */}
      <div style={{display:'flex',gap:10,flexWrap:'wrap',marginBottom:32}}>
        <div className="input-chip">
          <span className="chip-lbl">Day Master</span>
          <span className="chip-val">{dm.char} {dm.kor} · {elKor[dm.el]}</span>
        </div>
        {mbtiLabel && (
          <div className="input-chip">
            <span className="chip-lbl">MBTI{usedMbti ? '' : ' (est.)'}</span>
            <span className="chip-val" style={{color:'var(--gold3)',fontWeight:700}}>{mbtiLabel}</span>
          </div>
        )}
        <div className="input-chip">
          <span className="chip-lbl">Chart strength</span>
          <span className="chip-val">{strong?'Strong':'Weak'}</span>
        </div>
      </div>

      {/* ── PRIMARY + SECONDARY ARCHETYPE — Full career coaching ── */}
      {archetypes.map((a, idx) => (
        <div key={a.id} className="rpanel">
          <div className="rpanel-head">
            <span className="rpanel-label">
              {idx === 0 ? '① Primary Archetype' : '② Secondary Archetype'}
            </span>
          </div>
          <div className="rpanel-body" style={{padding:'20px'}}>
            <div className={"arc-block " + (idx===0 ? 'primary' : 'secondary')} style={{marginBottom:0}}>
              <div className="arc-name">{a.emoji} {a.label}</div>
              <div className="arc-tagline">"{a.tagline}"</div>
              <div className="arc-desc">{a.desc}</div>
            </div>

            {/* Seasonal modifier — primary only */}
            {idx === 0 && seasonal && (() => {
              const mod = getSeasonalModifier(a.id, seasonal.band);
              if (!mod) return null;
              const bandColor = seasonal.band === 'strong' ? '#4A7C59' : seasonal.band === 'neutral' ? '#B8963E' : '#7A6A4A';
              return (
                <div className="seasonal-card">
                  <div className="seasonal-header">
                    <div className="seasonal-badge" style={{color: bandColor, borderColor: bandColor + '55', background: bandColor + '11'}}>
                      {seasonal.label.badge}
                    </div>
                    <div className="seasonal-meta">
                      {seasonal.monthChar} month · {seasonal.season}
                    </div>
                  </div>
                  <div className="seasonal-style">{mod.style}</div>
                  <p className="seasonal-insight">{mod.insight}</p>
                  <div className="seasonal-rows">
                    <div className="seasonal-row">
                      <div className="seasonal-row-label">Career lens</div>
                      <div className="seasonal-row-text">{mod.careerLens}</div>
                    </div>
                    <div className="seasonal-row">
                      <div className="seasonal-row-label">Watch</div>
                      <div className="seasonal-row-text">{mod.watch}</div>
                    </div>
                  </div>
                </div>
              );
            })()}

            {/* Roles — accordion per tier */}
            {(() => {
              const TIERS = [
                { key:'entry', label:'Entry-level · 0–2 yrs' },
                { key:'mid',   label:'Mid-level · 3–6 yrs' },
                { key:'pivot', label:'Senior / Pivot · 7+ yrs' },
              ];
              return (
                <div className="coach-section">
                  <div className="coach-sec-label">Roles to target</div>
                  {TIERS.map(tier => {
                    const roles = a.roles[tier.key];
                    if (!roles?.length) return null;
                    return (
                      <RoleTier key={tier.key} label={tier.label} roles={roles} />
                    );
                  })}
                </div>
              );
            })()}

            {/* Industries — top 3 visible, rest collapsible */}
            {(() => {
              const top = a.industries.slice(0, 3);
              const rest = a.industries.slice(3);
              return (
                <IndustrySection top={top} rest={rest} />
              );
            })()}

            {/* Seek / Avoid */}
            <div className="seek-avoid-grid">
              <div className="seek-col">
                <div className="seek-label seek">✓ Seek out</div>
                {a.seek.map((s,i) => <div key={i} className="seek-item">{s}</div>)}
              </div>
              <div className="seek-col">
                <div className="seek-label avoid">✕ Avoid</div>
                {a.avoid.map((s,i) => <div key={i} className="avoid-item">{s}</div>)}
              </div>
            </div>

            {/* Burnout — primary only */}
            {idx === 0 && (
              <div className="coach-section">
                <div className="coach-sec-label">Your burnout pattern</div>
                <div className="burnout-box">
                  <p style={{fontSize:13,color:'var(--ink2)',lineHeight:1.7,marginBottom:10}}>{a.burnout}</p>
                  <div className="burnout-recovery">
                    <span style={{fontWeight:700,color:'var(--gold3)'}}>Recovery: </span>
                    {a.burnout_recovery}
                  </div>
                </div>
              </div>
            )}

            {/* Daily Energy — replaces static This Week */}
            {idx === 0 && (() => {
              const de = getDailyEnergy(dm.el, a.id);
              return (
                <div className="coach-section">
                  <div className="coach-sec-label">Today's energy</div>
                  <div className="daily-energy-card">
                    <div className="de-header">
                      <div className="de-date">{de.date}</div>
                      <div className="de-badge" style={{background: de.rel.color + '22', color: de.rel.color, border: `1px solid ${de.rel.color}55`}}>
                        {de.rel.badge}
                      </div>
                    </div>
                    <div className="de-wuxing">
                      <span className="de-stem">{de.todayStem}</span>
                      <span className="de-stem-rom">{de.todayStemRom} day</span>
                      <span className="de-dot">·</span>
                      <span className="de-el" style={{color: EL_COLOR[de.todayEl]}}>{de.todayEl}</span>
                      <span className="de-rel-label">{de.rel.label}</span>
                    </div>
                    <div className="de-theme">{de.reading.theme}</div>
                    <p className="de-focus">{de.reading.focus}</p>
                    <div className="de-caution">
                      <span className="de-caution-label">Watch: </span>{de.reading.caution}
                    </div>
                    <div className="de-action-row">
                      <div className="de-action-label">Today's move</div>
                      <div className="de-action-text">{de.reading.action}</div>
                    </div>
                  </div>
                </div>
              );
            })()}

            {/* Interview edge — primary only */}
            {idx === 0 && (
              <div className="coach-section">
                <div className="coach-sec-label">Your interview edge</div>
                <div className="interview-box">{a.interview}</div>
              </div>
            )}

            {/* Core strategy */}
            <div className="coach-section">
              <div className="coach-sec-label">{idx===0 ? 'Core strategy' : 'Strategy from your secondary type'}</div>
              <div className="strategy-box">{a.strategy}</div>
            </div>
          </div>
        </div>
      ))}

      {/* How calculated */}
      {mbtiLabel && (
        <div className="rpanel">
          <div className="rpanel-head">
            <span className="rpanel-label">How this was calculated</span>
          </div>
          <div className="rpanel-body">
            <div style={{display:'flex',gap:10,marginBottom:16,flexWrap:'wrap'}}>
              <div className="calc-bar">
                <div style={{height:4,borderRadius:2,background:'var(--gold)',width:'60%',marginBottom:5}}/>
                <span className="calc-bar-lbl">MBTI {mbtiLabel} — <strong>60%</strong></span>
              </div>
              <div className="calc-bar">
                <div style={{height:4,borderRadius:2,background:EL_COLOR[dm.el],width:'40%',marginBottom:5}}/>
                <span className="calc-bar-lbl">Day Master element — <strong>40%</strong></span>
              </div>
            </div>
            {axes && (
              <div style={{display:'flex',gap:8,flexWrap:'wrap',marginBottom:10}}>
                {[
                  {v: axes.I ? 'Introvert (I)' : 'Extrovert (E)'},
                  {v: axes.N ? 'Intuition (N)' : 'Sensing (S)'},
                  {v: axes.T ? 'Thinking (T)' : 'Feeling (F)'},
                  {v: axes.J ? 'Judging (J)' : 'Perceiving (P)'},
                ].map((x,i) => (
                  <span key={i} className="axis-chip">{x.v}</span>
                ))}
              </div>
            )}
            <p style={{fontSize:12,color:'var(--ink4)',lineHeight:1.6}}>
              {usedMbti ? 'Your MBTI ' + mbtiLabel : 'Estimated ' + mbtiLabel} axes determine 60% of the weighting.
              Day Master element accounts for the remaining 40%.
            </p>
          </div>
        </div>
      )}

      {/* Four Pillars */}
      <div className="rpanel">
        <div className="rpanel-head"><span className="rpanel-label">Four Pillars (사주)</span></div>
        <div className="rpanel-body">
          <div className="dm-badge">
            <span className="dm-char">{dm.char}</span>
            <div className="dm-info">
              <span className="dm-lbl">Day Master</span>
              <span className="dm-val">
                {dm.kor} <span style={{fontWeight:300,fontSize:12,color:'var(--ink3)'}}>({dm.name})</span>
                {' · '}{elKor[dm.el]} {dm.el}
                {' · '}{dm.pol==='Yang' ? 'Yang (陽)' : 'Yin (陰)'}
              </span>
            </div>
          </div>
          <div className="pillars-row">
            {cols.map(({l, lk, p}) => (
              <div key={l} className="pcol">
                <div className="pcol-lbl">
                  <span className="lbl-kr">{lk}</span>
                  <span className="lbl-en">{l}</span>
                </div>
                <div className="pcol-stem" style={{color: EL_COLOR[STEM_EL[p.s]]}}>{STEMS[p.s]}</div>
                <div className="pcol-kor"  style={{color: EL_COLOR[STEM_EL[p.s]]}}>{STEM_KOR[p.s]}</div>
                <div className="pcol-rom">{STEM_ROM[p.s]}</div>
                <div className="pcol-mid" />
                <div className="pcol-branch" style={{color: EL_COLOR[BRANCH_EL[p.b]]}}>{BRANCHES[p.b]}</div>
                <div className="pcol-kor"    style={{color: EL_COLOR[BRANCH_EL[p.b]]}}>{BRANCH_KOR[p.b]}</div>
                <div className="pcol-rom">{BRANCH_ROM[p.b]}</div>
              </div>
            ))}
          </div>
          {!pillars.hour && <p style={{fontSize:12,color:'var(--ink4)',marginBottom:16}}>Hour pillar omitted — birth time unknown</p>}
          <div className="el-list">
            {Object.entries(ec).sort((a,b)=>b[1]-a[1]).map(([el,v]) => (
              <div key={el} className="el-row">
                <span className="el-name"><span style={{fontWeight:700}}>{elKor[el]}</span><br/><span style={{fontSize:9,opacity:.6}}>{el}</span></span>
                <div className="el-track"><div className="el-fill" style={{width:(v/tot*100)+'%', background:EL_COLOR[el]}}/></div>
                <span className="el-pct">{Math.round(v/tot*100)}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Stress */}
      {stress && (
        <div className="rpanel">
          <div className="rpanel-head"><span className="rpanel-label">Stress Indicator</span></div>
          <div className="rpanel-body">
            <div className="stress-box">
              <div className="stress-lbl">I + J pattern detected</div>
              <div className="stress-txt">
                Introverted Judgers (I+J) tend to over-plan and ruminate under pressure. Set a hard decision deadline: 48 hours max, then commit.
              </div>
            </div>
            <p style={{fontSize:13,color:'var(--ink3)',lineHeight:1.7,fontWeight:300}}>
              Recovery: Find one task you can complete in the next 2 hours and finish it. Small wins break the loop.
            </p>
          </div>
        </div>
      )}

      {/* Timing CTA */}
      {timing && (
        <div className="timing-cta-wrap">
          <div className="timing-cta-eyebrow">Career Timing</div>
          <p className="timing-cta-desc">Your Four Pillars chart encodes a sequence of decennial energy cycles — each one shaping the conditions for different kinds of career moves. See your current decade, this year, and what's coming next.</p>
          <button className="timing-cta-btn" onClick={() => { setTimingData({ timing, bazi, archetypes, birthYear, currentAge, seasonal }); setPage('timing'); }}>
            View your timing →
          </button>
        </div>
      )}

            <div className="res-footer">
        <p>Want to understand the methodology?</p>
        <button className="inline-link" onClick={() => setPage('about')}>Read how it works →</button>
      </div>
    </div>
  );
}



// ─────────────────────────────────────────────────────────────
// TIMING PAGE — Career Timing · Decennial Luck Cycles
// ─────────────────────────────────────────────────────────────
function TimingPage({ data, setPage }) {
  const { timing, bazi, archetypes, birthYear, currentAge } = data;
  const { dm } = bazi;
  const [timelineOpen, setTimelineOpen] = useState(false);
  const [openTlIdx, setOpenTlIdx] = useState(null);
  const primaryId = archetypes[0]?.id;
  const { dayuns, curIdx, isForward, annualInf, annualMeta } = timing;

  const cur  = dayuns[curIdx];
  const next = dayuns[curIdx + 1];

  const decadeCtx  = DECADE_CONTEXT[primaryId]?.[cur.inf] || '';
  const crossRead  = getCrossReading(primaryId, cur.inf, annualInf);
  const nextCtx    = next ? DECADE_CONTEXT[primaryId]?.[next.inf] : null;

  return (
    <div className="timing-page fade">
      <button className="res-back" onClick={() => setPage('results')}>← Back to report</button>

      <div className="timing-page-eyebrow">GAT · Career Timing</div>
      <h1 className="timing-page-h1">Your Timing</h1>

      {/* ── DECADE CONTEXT ── */}
      <div className="tp-decade-wrap">
        <div className="tp-decade-header">
          <div className="tp-decade-left">
            <div className="tp-decade-chars">
              <span style={{color: EL_COLOR[cur.el]}}>{STEMS[cur.si]}</span>
              <span style={{color: EL_COLOR[cur.branchEl]}}>{BRANCHES[cur.bi]}</span>
            </div>
            <div>
              <div className="tp-decade-inf" style={{color: cur.meta.color}}>{cur.meta.label}</div>
              <div className="tp-decade-theme">{cur.meta.theme}</div>
            </div>
          </div>
          <div className="tp-decade-range">
            <div className="tp-decade-ages">{cur.fromAge.toFixed(0)}–{cur.toAge.toFixed(0)} yrs</div>
            <div className="tp-decade-years">{cur.fromYear}–{cur.toYear}</div>
          </div>
        </div>
        <p className="tp-decade-body">{decadeCtx}</p>
      </div>

      {/* ── NOW FOCUS: cross-reading ── */}
      <div className="tp-now-wrap">
        <div className="tp-now-eyebrow">
          <span className="tp-now-badge">NOW</span>
          <span className="tp-now-year">2026 · 丙午</span>
          <div className="tp-now-inf-badge" style={{background: annualMeta.color+'1a', color: annualMeta.color, borderColor: annualMeta.color+'44'}}>
            {annualMeta.label} year · {annualMeta.theme}
          </div>
        </div>

        <div className="tp-now-headline">{crossRead.headline}</div>
        <p className="tp-now-body">{crossRead.body}</p>

        <div className="tp-actions-wrap">
          <div className="tp-actions-label">Do these now</div>
          {crossRead.actions.map((action, i) => (
            <div key={i} className="tp-action-row">
              <div className="tp-action-num">{i + 1}</div>
              <div className="tp-action-text">{action}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── NEXT DECADE ── */}
      {next && nextCtx && (
        <div className="tp-next-wrap">
          <div className="tp-next-label">Coming up · from {next.fromYear}</div>
          <div className="tp-next-header">
            <span className="tp-next-chars">
              <span style={{color: EL_COLOR[next.el]+'99'}}>{STEMS[next.si]}</span>
              <span style={{color: EL_COLOR[next.branchEl]+'99'}}>{BRANCHES[next.bi]}</span>
            </span>
            <span className="tp-next-inf" style={{color: next.meta.color+'99'}}>{next.meta.label} · {next.meta.theme}</span>
            <span className="tp-next-age">{next.fromAge.toFixed(0)}–{next.toAge.toFixed(0)} yrs</span>
          </div>
          <p className="tp-next-body">{nextCtx}</p>
          <div className="tp-next-hint">What you build in the current decade determines what you have available to execute in this one.</div>
        </div>
      )}

      {/* ── FULL TIMELINE (collapsible) ── */}
      <div className="tp-tl-toggle-wrap">
        <button className="tp-tl-toggle-btn" onClick={() => setTimelineOpen(o => !o)}>
          {timelineOpen ? 'Hide full cycle ↑' : 'View all decades ↓'}
        </button>
      </div>
      {timelineOpen && (
        <div className="tp-timeline">
          {dayuns.map((d, i) => {
            const isCur  = i === curIdx;
            const ctx    = DECADE_CONTEXT[primaryId]?.[d.inf] || '';
            const isOpen = openTlIdx === i;
            return (
              <div key={i} className={"tp-tl-row" + (isCur ? ' current' : '')}>
                <div className="tp-tl-summary" onClick={() => setOpenTlIdx(isOpen ? null : i)}>
                  <div className="tp-tl-left">
                    <span className="tp-tl-char" style={{color: EL_COLOR[d.el]}}>{STEMS[d.si]}</span>
                    <span className="tp-tl-char" style={{color: EL_COLOR[d.branchEl]}}>{BRANCHES[d.bi]}</span>
                    <span className="tp-tl-inf" style={{color: d.meta.color}}>{d.meta.label}</span>
                    {isCur && <span className="tp-tl-now">NOW</span>}
                  </div>
                  <div className="tp-tl-right">
                    <span className="tp-tl-age">{d.fromAge.toFixed(0)}–{d.toAge.toFixed(0)}</span>
                    <span className="tp-tl-year">{d.fromYear}–{d.toYear}</span>
                    <span className="tp-tl-toggle">{isOpen ? '−' : '+'}</span>
                  </div>
                </div>
                {isOpen && (
                  <div className="tp-tl-detail">
                    <div className="tp-tl-theme">{d.meta.theme}</div>
                    <p className="tp-tl-body">{ctx}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* ── METHOD NOTE ── */}
      <div className="tp-method-note">
        <div className="tp-method-label">How this is calculated</div>
        <p>Decennial cycles begin at an age determined by the number of days between birth and the nearest Jieqi (solar term) boundary ÷ 3 (3 days = 1 year). Direction: Yang Day Master + Male or Yin Day Master + Female runs forward (順行); the reverse runs backward (逆行). Your Day Master is {dm.char} ({dm.el}, {dm.pol}) — cycles run {isForward ? 'forward' : 'backward'}. The "influence" describes the relationship between your Day Master and the stem of each decade.</p>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// ABOUT
// ─────────────────────────────────────────────
function AboutPage({ openFaq, setFaq }) {
  const faqs = [
    { q: `Is the hour pillar required?`,
      a: `No. Year, month, and day pillars produce a complete and usable chart. Hour pillar adds nuance but requires accurate birth time. If you don't know your time, the core profile is still accurate.` },
    { q: `Why does the year change at Lichun, not Lunar New Year?`,
      a: `Four Pillars uses solar boundaries called Jieqi (절기) — 24 astronomical divisions of the year. The year changes at Lichun (입춘, Spring Beginning), typically February 3–4, not at the Lunar New Year. This is the classical convention used by all professional practitioners.` },
    { q: `How is timezone handled?`,
      a: `We use the browser's Intl.DateTimeFormat API for DST-accurate local-to-UTC conversion for all worldwide timezones. Solar term timestamps are in UTC, so the accuracy of your result depends on selecting the correct timezone for your city of birth.` },
    { q: `Why only 4 archetypes?`,
      a: `Four archetypes — Builder, Analyst, Connector, Creator — map naturally to the Five Element pairs and produce meaningfully different career and study guidance. More archetypes introduce false precision. The top-2 result adds enough nuance without overwhelming the signal.` },
    { q: `Why MBTI instead of custom questions?`,
      a: `Custom questionnaires are answered differently depending on mood, stress level, and context — making results inconsistent. MBTI is a self-identity that people carry stably over time. Combined with the Four Pillars chart, it produces a more reliable profile than any on-the-spot questionnaire.` },
    { q: `Is GAT the same as Western astrology or MBTI?`,
      a: `No. Four Pillars is a deterministic solar calendar system — purely mathematical, with no planets or archetypes imposed externally. MBTI is self-reported personality typing. GAT combines astronomical calculation (the chart) with self-reported personality type (MBTI) to produce a single integrated result.` },
    { q: `Does the seasonal theory apply differently in the Southern Hemisphere?`,
      a: `No — and this is a common misconception. BaZi seasonal months are defined by Jieqi (절기) solar terms, which track the Earth's position relative to the Sun. Lichun (立春) is always around February 4 regardless of where you were born. The system uses astronomical time, not local physical seasons. A person born in Sydney in July is in the same 午月 (Fire season) as someone born in Seoul in July.` },
  ];

  return (
    <div className="about-wrap fade">
      <div className="about-hero">
        <div className="about-gat-lg"><GatSvg size={36} /></div>
        <h1 className="about-h1">About GAT</h1>
        <p className="about-lead">
          GAT is a career coaching tool that combines Korean Four Pillars astrology (Saju, 사주) with MBTI personality typing.
          Everything runs locally in your browser — no accounts, no stored data, no server calls.
        </p>
      </div>

      <div className="about-sec">
        <h2 className="about-sec-h">The Four Pillars <span className="about-kr">사주팔자</span></h2>
        <p className="about-p">
          Saju (사주) — literally "four pillars" — is a Korean and Chinese system that maps a person's birth date and time onto the solar calendar. Each pillar pairs a Heavenly Stem with an Earthly Branch, producing eight characters (팔자) that encode elemental tendencies and timing patterns.
        </p>
        <p className="about-p">
          Unlike Western astrology, Saju is entirely mathematical. It is based on Jieqi (절기) — 24 precise astronomical events that divide the year into solar intervals. There are no planets or house systems. Given the same birth data and timezone, anyone will always get the same result.
        </p>
        <div className="p4-grid">
          {[
            { ch:'年', name:'Year Pillar',  desc:'Broad tendencies and generational context. Changes at Lichun (입춘) — not Lunar New Year.' },
            { ch:'月', name:'Month Pillar', desc:'Domain and field affinity. Changes at each of the 12 major solar terms.' },
            { ch:'日', name:'Day Pillar',   desc:'Your Day Master — the elemental core of the chart. The most important pillar.' },
            { ch:'時', name:'Hour Pillar',  desc:'Fine-grained expression. Requires accurate birth time. Optional but useful.' },
          ].map(p => (
            <div key={p.ch} className="p4-card">
              <div className="p4-char">{p.ch}</div>
              <div className="p4-name">{p.name}</div>
              <div className="p4-desc">{p.desc}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="about-sec">
        <h2 className="about-sec-h">Seasonal Strength Theory <span className="about-kr">왕상휴수사</span></h2>
        <p className="about-p">
          One of the most important interpretive layers in Four Pillars is <strong>旺相休囚死</strong> (Wang Xiang Xiu Qiu Si) — the theory of seasonal elemental strength. Each element has a peak season, a supported season, a resting season, and seasons of restraint or exhaustion.
        </p>
        <p className="about-p">
          The month of birth determines which season the Day Master element was born into. A Wood Day Master born in spring (寅卯辰 months) is 旺 (Wang) — at peak strength. The same Wood element born in autumn is 囚死 — restrained by Metal, the controlling element. This changes not what you are, but how your energy moves and where it's best directed.
        </p>
        <p className="about-p">
          GAT uses this to produce a <strong>seasonal style modifier</strong> layered on top of your archetype — same Builder or Creator, different operational mode depending on whether your element is in-season (amplified and outward) or out-of-season (conserved and internal).
        </p>
        <div className="about-ref-box">
          <div className="about-ref-label">Classical sources for this theory</div>
          <div className="about-ref-list">
            <div className="about-ref-item">
              <span className="about-ref-title">三命通會 Sanming Tonghui</span>
              <span className="about-ref-desc">Ming dynasty (c. 1550). The most comprehensive classical BaZi compendium. Primary source for 旺相休囚死 tables.</span>
            </div>
            <div className="about-ref-item">
              <span className="about-ref-title">淵海子平 Yuanhai Ziping</span>
              <span className="about-ref-desc">Song dynasty (c. 1200). Foundational text establishing Day Master as the central reference point for chart interpretation.</span>
            </div>
            <div className="about-ref-item">
              <span className="about-ref-title">滴天髓 Di Tian Sui</span>
              <span className="about-ref-desc">Ming/Qing dynasty. Advanced text on Day Master strength assessment and its relationship to useful elements (用神 Yongsheng).</span>
            </div>
            <div className="about-ref-item">
              <span className="about-ref-title">子平真詮 Ziping Zhengquan</span>
              <span className="about-ref-desc">Shen Xiaozhan, Qing dynasty (1796). Systematic methodology for assessing seasonal strength and its practical implications.</span>
            </div>
          </div>
        </div>
        <p className="about-p" style={{fontSize:11, color:'var(--ink4)', lineHeight:1.6, marginTop:8}}>
          Note: Seasonal strength in BaZi is calculated from solar calendar month (절기 Jieqi boundaries), not the Gregorian calendar month. It is hemisphere-independent — the calculation follows the Earth's solar position, not local physical seasons.
        </p>
      </div>

      <div className="about-sec">
        <h2 className="about-sec-h">Five Elements <span className="about-kr">오행</span></h2>
        <p className="about-p">Each stem and branch maps to one of five elements — not material substances, but energetic modes of processing and acting.</p>
        <div className="el-legend">
          {[
            { el:'Wood',  color:'#7a9e6e', desc:'Growth orientation, persistence, direction. Tends toward building and creating.' },
            { el:'Fire',  color:'#c06030', desc:'Social energy, expressiveness, warmth. Tends toward communication and connection.' },
            { el:'Earth', color:'#a88840', desc:'Steadiness, care, pragmatism. Tends toward support and practical delivery.' },
            { el:'Metal', color:'#8896a0', desc:'Precision, structure, discernment. Tends toward systems and standards.' },
            { el:'Water', color:'#5080a0', desc:'Depth, adaptability, investigation. Tends toward analysis and understanding.' },
          ].map(e => (
            <div key={e.el} className="el-leg-row">
              <div className="el-dot-lg" style={{ background: e.color }} />
              <div className="el-leg-text">
                <div className="el-leg-name">{e.el}</div>
                <div className="el-leg-desc">{e.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="about-sec">
        <h2 className="about-sec-h">MBTI Integration</h2>
        <p className="about-p">
          The Four Pillars chart describes elemental energy patterns — but not how those tendencies have developed in your specific personality. MBTI captures that layer. GAT weights MBTI axes at 60% and Day Master element at 40%, combining objective timing data with stable self-reported personality type.
        </p>
        <p className="about-p">
          Each question is a bipolar 1–5 scale between two orientations. Scores are weighted across four archetypes — Builder, Analyst, Connector, Creator — and your Day Master element adds a secondary boost. The top two archetypes form your profile.
        </p>
      </div>

      <div className="about-sec">
        <h2 className="about-sec-h">Privacy</h2>
        <div className="priv-box">
          <strong>Everything runs in your browser.</strong> No birth data, answers, or results are ever sent to a server.
          There is no account system, no database, and no analytics attached to your inputs.
          When you close the tab, everything is gone. GAT is designed to be a tool, not a platform.
        </div>
      </div>

      <div className="about-sec">
        <h2 className="about-sec-h">Common Questions</h2>
        <div>
          {faqs.map((f, i) => (
            <div key={i} className="faq-item">
              <div className="faq-q" onClick={() => setFaq(openFaq === i ? null : i)}>
                <span>{f.q}</span>
                <span className="faq-toggle">{openFaq === i ? '−' : '+'}</span>
              </div>
              {openFaq === i && <div className="faq-a">{f.a}</div>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
