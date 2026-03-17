import { Component, inject, linkedSignal, signal } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { form, FormField, required, email, minLength, pattern } from '@angular/forms/signals';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatIcon } from '@angular/material/icon';
import { MatStepper, MatStep, MatStepLabel, MatStepperNext, MatStepperPrevious } from '@angular/material/stepper';

import { CartStore } from '../../store/cart.store';
import { CustomerInfo } from '../../models/order.model';

@Component({
  selector: 'app-checkout-page',
  imports: [
    CurrencyPipe, RouterLink, FormField,
    MatFormField, MatLabel, MatInput,
    MatIcon,
    MatStepper, MatStep, MatStepLabel, MatStepperNext, MatStepperPrevious,
  ],
  templateUrl: './checkout-page.component.html',
  styleUrl: './checkout-page.component.css',
})
export class CheckoutPageComponent {
  readonly cartStore = inject(CartStore);
  private readonly router = inject(Router);

  checkoutModel = signal<CustomerInfo>({
    firstName: '', lastName: '', email: '',
    phone: '', address: '', city: '', zipCode: '',
  });

  checkoutForm = form(this.checkoutModel, (schema) => {
    required(schema.firstName, { message: 'First name is required' });
    required(schema.lastName, { message: 'Last name is required' });
    required(schema.email, { message: 'Email is required' });
    email(schema.email, { message: 'Enter a valid email address' });
    required(schema.phone, { message: 'Phone is required' });
    pattern(schema.phone, /^\+?[\d\s\-()]{7,}$/, { message: 'Enter a valid phone number' });
    required(schema.address, { message: 'Address is required' });
    required(schema.city, { message: 'City is required' });
    required(schema.zipCode, { message: 'Zip code is required' });
    minLength(schema.zipCode, 5, { message: 'Zip code must be at least 5 characters' });
  });

  shippingCost = linkedSignal(() => (this.cartStore.totalPrice() > 500 ? 0 : 9.99));

  isFormValid() {
    return (
      this.checkoutForm.firstName().valid() &&
      this.checkoutForm.lastName().valid() &&
      this.checkoutForm.email().valid() &&
      this.checkoutForm.phone().valid() &&
      this.checkoutForm.address().valid() &&
      this.checkoutForm.city().valid() &&
      this.checkoutForm.zipCode().valid()
    );
  }

  onSubmit(event: Event) {
    event.preventDefault();
    if (!this.isFormValid()) return;

    const order = {
      customer: this.checkoutModel(),
      items: this.cartStore.entities(),
      subtotal: this.cartStore.totalPrice(),
      shipping: this.shippingCost(),
      tax: 0,
      total: this.cartStore.totalPrice() + this.shippingCost(),
    };

    console.log('Order placed:', order);
    this.cartStore.clearCart();
    this.router.navigate(['/order-confirmation']);
  }
}
