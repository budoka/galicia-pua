import { ObjectLiteral } from 'src/types';
// import { propertiesOf } from 'ts-reflection';

import { keys } from 'ts-transformer-keys';
/**
 * Get the parsed value with the expected type.
 * @param value value to parse.
 */
export function parseValue(value: string) {
  let val: string | number | boolean = value;
  if (val === '0' || !!Number(val)) val = Number(val);
  else if (val && /^true$/i.test(val)) val = true;
  else if (val && /^false$/i.test(val)) val = false;
  return val;
}

export function parseObject2<S, T extends object = any>(source: S): T {
  console.log('parseObject');
  const keys = Object.keys(source);
  const target: T = {} as T;
  console.log(keys);

  const values: T = Object.assign(target, source);
  console.log(values);
  return values;
}

export function parseObject<S, T extends object>(source: S) {
  console.log('parseObject');
  const sKeys = Object.keys(source);
  const sValues = Object.values(source);

  //const keysOfProps = keys<Props>();
  //const keysOfProps = propertiesOf<CajaTypeFilterAPIResponse>();

  //console.log(keysOfProps);
  const raw = {} as ObjectLiteral;

  sKeys.map((key, index) => {
    raw[key] = sValues[index];
  });

  return raw;
}
