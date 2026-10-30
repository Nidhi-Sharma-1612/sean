export interface Testimonial {
  id: string;
  quote: string;
  author: string;
  cabin: string;
  rating?: number;
}

// Empty until real guest quotes are supplied; the section hides itself meanwhile.
export const testimonials: Testimonial[] = [];
