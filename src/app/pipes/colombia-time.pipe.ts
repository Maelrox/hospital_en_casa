import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'colombiaTime',
  standalone: true
})
export class ColombiaTimePipe implements PipeTransform {
  transform(value: string): string {
    if (!value) return '';
    
    // Parse the UTC time
    const date = new Date(value);
    
    // Subtract 5 hours for Colombia time (UTC-5)
    date.setHours(date.getHours() - 5);
    
    // Format as YYYY-MM-DD hh:mm a
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = date.getHours() % 12 || 12; // Convert to 12-hour format
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const ampm = date.getHours() >= 12 ? 'PM' : 'AM';
    
    return `${year}-${month}-${day} ${hours}:${minutes} ${ampm}`;
  }
} 