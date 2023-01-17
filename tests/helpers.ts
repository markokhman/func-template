import { Address } from "ton";
import Prando from "prando";

export const zeroAddress = new Address(0, Buffer.alloc(32, 0));

export function randomAddress(seed: string, workchain?: number) {
  const random = new Prando(seed);
  const hash = Buffer.alloc(32);
  for (let i = 0; i < hash.length; i++) {
    hash[i] = random.nextInt(0, 255);
  }
  return new Address(workchain ?? 0, hash);
}
