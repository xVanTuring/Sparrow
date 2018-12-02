import path from 'path'
import rndName from './randomName'
import uuid from 'uuid/v4'
let list1 = [
  '2013-12-08.jpg',
  '2013-12-09.jpg',
  '2013-12-10.jpg',
  '2013-12-11.jpg',
  '2013-12-12.jpg',
  '2013-12-13.jpg',
  '2013-12-14.jpg',
  '2013-12-15.jpg',
  '2013-12-16.jpg',
  '2013-12-17.jpg',
  '2013-12-18.jpg',
  '2013-12-19.jpg',
  '2013-12-20.jpg',
  '2013-12-21.jpg',
  '2013-12-22.jpg',
  '2013-12-23.jpg',
  '2013-12-24.jpg',
  '2013-12-25.jpg',
  '2013-12-26.jpg',
  '2013-12-27.jpg',
  '2013-12-28.jpg',
  '2013-12-29.jpg',
  '2013-12-30.jpg',
  '2013-12-31.jpg',
  'ArizonaArizonaTheWave_ZH-CN8266815643_1366x768.jpg',
  'BigeyeJacks_ZH-CN6509088214_1366x768.jpg',
  'CannonBeach_Clipcanvas_199988_ZH-CN576970678.jpg',
  'ChineseSnacks_ZH-CN9706134701_1366x768.jpg',
  'ColiseumInterior_ZH-CN5051646246_1366x768.jpg',
  'CrescentMoon_ZH-CN8608820541_1366x768.jpg',
  'DragonBoatFestival_ZH-CN8031174448_1366x768.jpg',
  'EmperorPenguinFather_ZH-CN8664412766_1366x768.jpg',
  'HorsesGrassland_ZH-CN6421300613_1366x768.jpg',
  'KhongorynEls_ZH-CN8051578516_1366x768.jpg',
  'KyotoStation_ZH-CN7160888932_1366x768.jpg',
  'MakingSomethingGreen_ZH-CN10559759083_1366x768.jpg',
  'MalaccaStraitsMosque_ZH-CN6064108282_1366x768.jpg',
  'MordagaInnerMongolia_ZH-CN6639849159_1366x768.jpg',
  'NasirAlMulkMosque_ZH-CN8314118304_1366x768.jpg',
  'NorthernGannet_ZH-CN7175770647_1366x768.jpg',
  'OiaNight_061313_ZH-CN11167850861_1366x768.jpg',
  'PatchworkLandscape_ZH-CN6728662377_1366x768.jpg',
  'QaidamBasinDesert_ZH-CN7139352626_1366x768.jpg',
  'RainbowSewardAlaska_ZH-CN6463897135_1366x768.jpg',
  'SchoolchildrenInUniform_ZH-CN8032531373_1366x768.jpg',
  'SilkyAnteater_ZH-CN7258670766_1366x768.jpg',
  'SkeweredFruit_ZH-CN4516491119_1366x768.jpg',
  'SunGlass_ZH-CN8658595087_1366x768.jpg',
  'SunsetReflection_Wilderness_Red12_ZH-CN2042055555.jpg',
  'TheFirstLight_ZH-CN9773092887_1366x768.jpg',
  'TigersNestMonastery_ZH-CN5781487781_1366x768.jpg',
  'TowerBridge_ZH-CN6858322528_1366x768.jpg',
  'YarnBomb_ZH-CN9304163214_1366x768.jpg',
  'ios_7_style_desktop_wallpaper_by_moozdeviant-d68kqsl.png',
  'zh-CN-20130618.jpg',
  'zh-CN-20130701.jpg',
  'zh-CN-20130702.jpg',
  'zh-CN-20130703.jpg',
  'zh-CN-20130704.jpg',
  'zh-CN-20130705.jpg',
  'zh-CN-20130706.jpg',
  'zh-CN-20130707.jpg',
  'zh-CN-20130708.jpg',
  'zh-CN-20130709.jpg',
  'zh-CN-20130710.jpg',
  'zh-CN-20130711.jpg',
  'zh-CN-20130712.jpg',
  'zh-CN-20130713.jpg',
  'zh-CN-20130714.jpg',
  'zh-CN-20130715.jpg',
  'zh-CN-20130716.jpg',
  'zh-CN-20130717.jpg',
  'zh-CN-20130718.jpg',
  'zh-CN-20130719.jpg',
  'zh-CN-20130720.jpg',
  'zh-CN-20130721.jpg',
  'zh-CN-20130722.jpg',
  'zh-CN-20130723.jpg',
  'zh-CN-20130724.jpg',
  'zh-CN-20130725.jpg',
  'zh-CN-20130726.jpg',
  'zh-CN-20130727.jpg',
  'zh-CN-20130728.jpg',
  'zh-CN-20130729.jpg',
  'zh-CN-20130730.jpg',
  'zh-CN-20130731.jpg',
  'zh-CN-20130801.jpg',
  'zh-CN-20130802.jpg',
  'zh-CN-20130803.jpg',
  'zh-CN-20130804.jpg',
  'zh-CN-20130805.jpg',
  'zh-CN-20130806.jpg',
  'zh-CN-20130807.jpg',
  'zh-CN-20130808.jpg',
  'zh-CN-20130809.jpg',
  'zh-CN-20130810.jpg',
  'zh-CN-20130811.jpg',
  'zh-CN-20130812.jpg',
  'zh-CN-20130813.jpg',
  'zh-CN-20130814.jpg',
  'zh-CN-20130815.jpg',
  'zh-CN-20130816.jpg',
  'zh-CN-20130817.jpg',
  'zh-CN-20130818.jpg',
  'zh-CN-20130819.jpg',
  'zh-CN-20130820.jpg',
  'zh-CN-20130821.jpg',
  'zh-CN-20130822.jpg',
  'zh-CN-20130823.jpg',
  'zh-CN-20130824.jpg',
  'zh-CN-20130825.jpg',
  'zh-CN-20130826.jpg',
  'zh-CN-20130827.jpg',
  'zh-CN-20130828.jpg',
  'zh-CN-20130829.jpg',
  'zh-CN-20130830.jpg',
  'zh-CN-20130831.jpg',
  'zh-CN-20130901.jpg',
  'zh-CN-20130902.jpg',
  'zh-CN-20130903.jpg',
  'zh-CN-20130904.jpg',
  'zh-CN-20130905.jpg',
  'zh-CN-20130906.jpg',
  'zh-CN-20130907.jpg',
  'zh-CN-20130908.jpg',
  'zh-CN-20130909.jpg',
  'zh-CN-20130910.jpg',
  'zh-CN-20130911.jpg',
  'zh-CN-20130912.jpg',
  'zh-CN-20130913.jpg',
  'zh-CN-20130914.jpg',
  'zh-CN-20130915.jpg',
  'zh-CN-20130916.jpg',
  'zh-CN-20130917.jpg',
  'zh-CN-20130918.jpg',
  'zh-CN-20130919.jpg',
  'zh-CN-20130920.jpg',
  'zh-CN-20130921.jpg',
  'zh-CN-20130922.jpg',
  'zh-CN-20130923.jpg',
  'zh-CN-20130924.jpg',
  'zh-CN-20130925.jpg',
  'zh-CN-20130926.jpg',
  'zh-CN-20130927.jpg',
  'zh-CN-20130928.jpg',
  'zh-CN-20130929.jpg',
  'zh-CN-20130930.jpg',
  'zh-CN-20131001.jpg',
  'zh-CN-20131002.jpg',
  'zh-CN-20131003.jpg',
  'zh-CN-20131004.jpg',
  'zh-CN-20131005.jpg',
  'zh-CN-20131006.jpg',
  'zh-CN-20131007.jpg',
  'zh-CN-20131008.jpg',
  'zh-CN-20131009.jpg',
  'zh-CN-20131010.jpg',
  'zh-CN-20131011.jpg',
  'zh-CN-20131012.jpg',
  'zh-CN-20131013.jpg',
  'zh-CN-20131014.jpg',
  'zh-CN-20131015.jpg',
  'zh-CN-20131016.jpg',
  'zh-CN-20131017.jpg',
  'zh-CN-20131018.jpg',
  'zh-CN-20131019.jpg',
  'zh-CN-20131020.jpg',
  'zh-CN-20131021.jpg',
  'zh-CN-20131022.jpg',
  'zh-CN-20131023.jpg',
  'zh-CN-20131024.jpg',
  'zh-CN-20131025.jpg',
  'zh-CN-20131026.jpg',
  'zh-CN-20131027.jpg',
  'zh-CN-20131028.jpg',
  'zh-CN-20131029.jpg',
  'zh-CN-20131030.jpg',
  'zh-CN-20131031.jpg',
  'zh-CN-20131101.jpg',
  'zh-CN-20131102.jpg',
  'zh-CN-20131103.jpg',
  'zh-CN-20131104.jpg',
  'zh-CN-20131105.jpg',
  'zh-CN-20131106.jpg',
  'zh-CN-20131107.jpg',
  'zh-CN-20131108.jpg',
  'zh-CN-20131109.jpg',
  'zh-CN-20131110.jpg',
  'zh-CN-20131111.jpg',
  'zh-CN-20131112.jpg',
  'zh-CN-20131113.jpg',
  'zh-CN-20131114.jpg',
  'zh-CN-20131115.jpg',
  'zh-CN-20131116.jpg',
  'zh-CN-20131117.jpg',
  'zh-CN-20131118.jpg',
  'zh-CN-20131119.jpg',
  'zh-CN-20131120.jpg',
  'zh-CN-20131121.jpg',
  'zh-CN-20131122.jpg',
  'zh-CN-20131123.jpg',
  'zh-CN-20131124.jpg',
  'zh-CN-20131125.jpg',
  'zh-CN-20131126.jpg',
  'zh-CN-20131127.jpg',
  'zh-CN-20131128.jpg',
  'zh-CN-20131129.jpg',
  'zh-CN-20131130.jpg'
]
export const basePath = '/home/xvan/Documents/htmltmp/thumb1'
export default function getListData () {
  return list1.map(item => {
    return {
      path: 'file://' + path.join(basePath, item),
      width: 1920,
      height: 1080,
      name: rndName(),
      id: uuid()
    }
  })
}
