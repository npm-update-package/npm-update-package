export const Dependency = {
  Bundle: 'bundle',
  Dev: 'dev',
  Optional: 'optional',
  Peer: 'peer',
  Prod: 'prod'
} as const
// eslint-disable-next-line @typescript-eslint/no-redeclare
export type Dependency = typeof Dependency[keyof typeof Dependency]
const values = Object.values(Dependency)
// eslint-disable-next-line @typescript-eslint/no-unsafe-argument
export const isDependency = (value: any): value is Dependency => values.includes(value)
