import {Component, ViewChild, AfterViewInit, OnInit, HostListener} from '@angular/core';

import {
  trigger,
  state,
  style,
  animate,
  transition
} from '@angular/animations';

import * as anime from 'animejs';
import {Product} from "../models/product.model";
import {ProductOrder} from "../models/product-order.model";
import {ProductOrders} from "../models/product-orders.model";
import {Subscription} from "rxjs/internal/Subscription";
import {EcommerceService} from "../services/EcommerceService";

import { ConfigService } from '../services/config.service';
import { initDomAdapter } from '@angular/platform-browser/src/browser';

@Component({
    selector: 'app-orders',
    templateUrl: './orders.component.html',
    styleUrls: ['./orders.component.css'],
    host: {'(window:resize)': 'onResize($event)'}
})
export class OrdersComponent implements OnInit {
    orders: ProductOrders;
    total: number;
    paid: boolean;
    sub: Subscription;


    title: string = 'wheel-of-choice';
      wheelIsTurning: boolean = false;
      spin: boolean = false;
      element: any = null;
      rotation: number = 0;
      center: number;
      width: number;
      sliceDeg: number;
      rectColor: string = '#FF0000';
      sliceColor: string = '#ec008c';
      ctx: CanvasRenderingContext2D;
      color: string[] = ['#d92626', '#ffbf00','#d92626', '#ffbf00','#d92626', '#ffbf00','#d92626', '#ffbf00'];
      label: string[] = ['Sushi', 'Ramen', 'Italia', 'Europa', 'Burger', 'Healthy', 'Street food'];
      choice: string = null;
      selected: string = null;
      discPrice: number;
      dsPrice: number;
      choosen: boolean = false;
      @ViewChild('myCanvas') myCanvas;

    @HostListener('window:resize', ['$event'])
    onResize(event){
     event.target.innerWidth; // window width
   }


    constructor(private ecommerceService: EcommerceService, private configService: ConfigService) {
        this.orders = this.ecommerceService.ProductOrders;
    }

    ngOnInit() {
        this.paid = false;
        this.sub = this.ecommerceService.OrdersChanged.subscribe(() => {
            this.orders = this.ecommerceService.ProductOrders;
            console.log("ordered Products "+this.ecommerceService.ProductOrder[0]);
        });
        this.loadTotal();

        this.getConfig();
    }

    pay() {
        this.paid = true;
        this.ecommerceService.saveOrder(this.orders).subscribe();
    }

    loadTotal() {
        this.sub = this.ecommerceService.TotalChanged.subscribe(() => {
                this.total = this.ecommerceService.Total;
        });
    }


    getConfig(): void {
        this.label = this.configService.getConfig();
      }

  ngAfterViewInit() {
      window.addEventListener('resize', this.resize, false);
      let vw = 700 * 0.01;
      if (window.innerWidth < 700) {
        vw = window.innerWidth * 0.01;
      }
      // Then we set the value in the --vh custom property to the root of the document
      document.documentElement.style.setProperty('--vw', `${vw}px`);

        var img = new Image();
      const canvas = this.myCanvas.nativeElement;
      this.ctx = canvas.getContext('2d');
      const slices = this.label.length;
      this.sliceDeg = 360 / slices;
      let deg = 0;
      this.width = canvas.width  ; // size
      this.center = this.width  / 2 ;      // center

      for (let i = 0; i < slices; i++) {
        console.log("degree "+deg);
        console.log("slice degree "+this.sliceDeg);
        this.drawSlice(deg, this.color[i]);
        this.drawText(deg + this.sliceDeg / 2, this.label[i].name);
        deg += this.sliceDeg;
       }

      this.ctx.beginPath();
      this.ctx.arc(this.center, this.center, 10, 0, 2 * Math.PI);
      this.ctx.fill();
      this.ctx.stroke();
      this.drawExternalBorder();

      for (let i = 0; i <= slices; i++) {
        this.drawBullet(this.sliceDeg * i);

      }

      this.tick();
    }

  resize() {
    let vw = 700 * 0.01;
    if (window.innerWidth < 700) {
      vw = window.innerWidth * 0.01;
    }
    // Then we set the value in the --vh custom property to the root of the document
    document.documentElement.style.setProperty('--vw', `${vw}px`);
  }

  deg2rad(deg) { return deg * Math.PI / 180; }

  drawSlice(deg, color) {
    this.ctx.beginPath();
    this.ctx.fillStyle = color;
    this.ctx.moveTo(this.center, this.center);
    // radius is ((this.width / 2) - 6) and not (this.width / 2) because we need place for the external bullet
    this.ctx.lineWidth = 5;
    this.ctx.arc(this.center, this.center, (this.width / 2) - 8, this.deg2rad(deg), this.deg2rad(deg + this.sliceDeg));
    this.ctx.lineWidth = 5;
    this.ctx.lineTo(this.center, this.center);
    this.ctx.fill();
    this.ctx.stroke();
  }
    hiLiteSlice(deg, color) {
    this.ctx.beginPath();
    this.ctx.fillStyle = color;
    this.ctx.shadowColor = '#ec008c';
    this.ctx.shadowBlur = 60;
    this.ctx.moveTo(this.center, this.center);
    // radius is ((this.width / 2) - 6) and not (this.width / 2) because we need place for the external bullet
    this.ctx.lineWidth = 1;
    this.ctx.arc(this.center, this.center, (this.width / 2) - 8, this.deg2rad(deg), this.deg2rad(deg + this.sliceDeg));
    this.ctx.fill();
    this.ctx.stroke();
  }

  drawExternalBorder() {
    this.ctx.moveTo(this.width - 8, this.center);
    this.ctx.beginPath();
    // this.ctx.arc(this.center, this.center, (this.width / 2) - 6, this.deg2rad(0), this.deg2rad(360));
    this.ctx.lineTo(this.width - 8, this.center);
    // this.ctx.arc(this.center, this.center, (this.width / 2) - 12, this.deg2rad(0), this.deg2rad(360));
    this.ctx.lineTo(this.width - 12, this.center);
    this.ctx.fillStyle = 'black';
    this.ctx.stroke();
  }

  drawBullet(deg) {
    this.ctx.lineWidth = 5;
    const x = this.center + (((this.width / 2) - 8) * Math.cos(this.deg2rad(deg)));
    const y = this.center + (((this.width / 2) - 8) * Math.sin(this.deg2rad(deg)));
    this.ctx.beginPath();
    this.ctx.arc(x, y, 5, 0, 2 * Math.PI);
    this.ctx.stroke();
    this.ctx.fill();
  }

  drawText(deg, text) {
    this.ctx.save();
    this.ctx.translate(this.center, this.center);
    this.ctx.rotate(this.deg2rad(deg));
    this.ctx.textAlign = 'right';
    this.ctx.fillStyle = '#fff';
    this.ctx.font = '35px Modak cursive';
    this.ctx.fillText(text, 300, 10);
    this.ctx.restore();
  }



    hiarc(deg,text)
    {
    this.ctx.save();
    this.ctx.translate(this.center, this.center);
    this.ctx.rotate(this.deg2rad(deg));
        // Fill with gradient
        this.ctx.fillStyle = gradient;
        this.ctx.fillText(text, 10, 90);
        this.ctx.restore();
    }
  tick() {
    requestAnimationFrame(() => {
      this.tick();
    });
  }


  addItems(){
    this.selected=this.choice;
    this.dsPrice=this.discPrice;
    console.log(this.dsPrice);
    this.total = this.total + this.dsPrice;
    console.log(this.total);
        var img = new Image();
    img.src = 'https://media.prod.mdn.mozit.cloud/attachments/2012/07/09/222/bcf90d24adf679755d47e6e2adf31afa/Canvas_createpattern.png';
    this.ctx.drawImage(img, 0, 45, 50, 50);

    console.log(img.src);

  }

  animate() {
    if (this.wheelIsTurning === false) {
      this.choice = null;
      this.choosen = false;
      this.rotation += Math.random() * 10,
        this.element = anime({
          targets: '#canvas',
          rotate: {
            value: this.rotation + 'turn',
            duration: 1800,
            easing: 'easeInOutSine'
          },
          begin: (anim) => {
            this.wheelIsTurning = true;
          },
          complete: (anim) => {
            this.choosen = true;
            this.wheelIsTurning = false;
            console.log("choice = ",this.choice);
            console.log(" Math.ceil(turnIndex) = ",Math.ceil(turnIndex));
            this.hiLiteSlice(Math.ceil(turnIndex) * this.sliceDeg, this.sliceColor);
            this.drawText(Math.ceil(turnIndex) * this.sliceDeg+20 ,this.choice);
            this.discPrice = this.label[Math.ceil(turnIndex)].disPrice;
            }
        });
      const rot = this.rotation - Math.round(this.rotation);
      const turn = ((0.75 - rot) / (1 / this.label.length)) - 1;
      const turnIndex = turn > this.label.length ? turn - 8 : turn;
      this.choice = Math.ceil(turnIndex) === 8 ? this.label[0].name : this.label[Math.ceil(turnIndex)].name;

    }
  }
}


const spinning: number = 1000 + Math.random() * 1000;

function randomizeAnimation() {
  return {
    transform: `rotate(${spinning}deg)`,
  };
}
