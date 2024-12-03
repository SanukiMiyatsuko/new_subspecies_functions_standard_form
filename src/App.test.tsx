import { expect, test } from 'vitest'
import { lt, stand, triangle, Z } from './code.ts'
import { Scanner } from './parse.ts';

test('0 < 0 = false', () => {
  expect(lt(Z,Z)).toBe(false)
})

test('1 < 1 = false', () => {
  const [x,y] = [new Scanner("1").parse_term(), new Scanner("1").parse_term()]
  expect(lt(x,y)).toBe(false)
})

test('亜(1,0,0) < 亜(1,0) = false', () => {
  const [x,y] = [new Scanner("亜(1,0,0)").parse_term(), new Scanner("亜(1,0)").parse_term()];
  expect(lt(x,y)).toBe(false)
})

test('亜(1,0) ∊ OT = true', () => {
  const x = new Scanner("亜(1,0)").parse_term();
  expect(stand(x)).toBe(true)
})

test('1 ◁ 1 = true', () => {
  const x = new Scanner("1").parse_term();
  expect(triangle(x,x)).toBe(true)
})

test('0 ◁ 0 = true', () => {
  const x = new Scanner("0").parse_term();
  expect(triangle(x,x)).toBe(true)
})