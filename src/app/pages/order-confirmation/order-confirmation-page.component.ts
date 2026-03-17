import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-order-confirmation-page',
  imports: [RouterLink, MatIcon],
  templateUrl: './order-confirmation-page.component.html',
  styleUrl: './order-confirmation-page.component.css',
})
export class OrderConfirmationPageComponent {
  orderNumber = Math.random().toString(36).substring(2, 10).toUpperCase();
}
