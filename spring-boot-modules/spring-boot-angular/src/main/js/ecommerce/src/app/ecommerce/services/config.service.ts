import { Injectable } from '@angular/core';

@Injectable({
providedIn: 'root'
})
export class ConfigService {

config: string[] =  [
{
"id": "0001",
"name": "IPHONE 12",
"discount": "20%",
"disPrice": 50125,
"image": "src/images/iphone-12_v1.jpg"
},
{
"id": "0002",
"name": "SONY LED TV",
"discount": "30%",
"disPrice": 40100,
"image": "..\images\iphone-12.jpg"
},
{
"id": "0003",
"name": "SAMSUNG LED TV",
"discount": "30%",
"disPrice": 40225,
"image": "..\images\iphone-12_v1"
},
{
"id": "0004",
"name": "WASHING MACHINE",
"discount": "25%",
"disPrice": 40000,
"image": "..\images\iphone-12_v1"
},
{
"id": "0005",
"name": "PANASONIC AC",
"discount": "20%",
"disPrice": 40125,
"image": "..\images\iphone-12_v1"
},
{
"id": "0006",
"name": "DISHWASHER",
"discount": "25%",
"disPrice": 50000,
"image": "..\images\iphone-12_v1"
},
{
"id": "0007",
"name": "VACCUM CLEANER",
"discount": "20%",
"disPrice": 10125,
"image": "..\images\iphone-12_v1"
},
{
"id": "0008",
"name": "APPLE IPAD",
"discount": "20%",
"disPrice": 50125,
"image": "..\images\iphone-12_v1"
}
]

constructor() { }

  getConfig(): string[] {
    return this.config;
  }

  setConfig(config: string[]) {
    this.config = config;
  }
}
