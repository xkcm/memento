import { Cacheable, CacheController } from "../src"

export const sleep = (time: number) => new Promise((res) => setTimeout(res, time*1000))

export const cacheController = new CacheController()
CacheController.setDefault(cacheController)

export const spiedFn = jest.fn()

export class TestClass {

  @Cacheable()
  public methodOne(argumentOne: number, argumentTwo?: string){
    spiedFn()
    return `You passed arguments: ${argumentOne}, ${argumentTwo}`
  }

  @Cacheable({ keepAlive: 3*1000 })
  public getSeconds(){
    return new Date().getSeconds()
  }

  @Cacheable({ keepAlive: 2*1000 })
  public getRandomNumber(){
    return Math.random()
  }
  
}
