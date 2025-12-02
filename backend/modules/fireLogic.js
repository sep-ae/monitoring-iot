let lastFireState = false;

export function checkFire(sensor, onFireCallback, onNormalCallback) {
  const { temperature, mq2 } = sensor;

  const TEMP_THRESHOLD = 60;
  const MQ2_THRESHOLD = 1000;

  const fire = (temperature >= TEMP_THRESHOLD) || (mq2 >= MQ2_THRESHOLD);

  // FIRE BARU TERDETEKSI
  if (fire && !lastFireState) {
    onFireCallback();
  }

  // API PADAM
  if (!fire && lastFireState) {
    onNormalCallback();
  }

  // simpan state
  lastFireState = fire;

  return fire;
}
