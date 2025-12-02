export function checkFire(sensor, onFireCallback, onNormalCallback) {
  const { temperature, mq2 } = sensor

  const TEMP_THRESHOLD = 60
  const MQ2_THRESHOLD = 1000

  let fire = (temperature >= TEMP_THRESHOLD) || (mq2 >= MQ2_THRESHOLD)

  if (fire) {
    onFireCallback()
  } else {
    onNormalCallback()
  }

  return fire
}
