import { groq } from "next-sanity";
import { client } from "../Sainity/client.js";

export const coursesQuery = groq`*[_type == "course"] | order(_createdAt desc) {
   _id,
  title,
  slug,
  description,
  category,
  level,
  duration,
  price,
  "image": image.asset->url  
}`;

export const courseBySlugQuery = groq`*[_type == "course" && slug.current == $slug][0] {
  _id,
  title,
  slug,
  description,
  category,
  level,
  duration,
  price,
  "image": image.asset->url,
  "syllabusUrl": syllabusUrl,
  "accreditation": accreditation,
  "examDates": examDates,
  reviews[] {
    _key,
    author,
    role,
    quote,
    rating
  }
}`;

export const testimonialsQuery = groq`*[_type == "testimonial"] | order(_createdAt desc) {
  _id,
  name,
  role,
  quote,
  rating,
  "photo": photo.asset->url
}`;

export const visaServicesQuery = groq`*[_type == "service"] | order(order asc) {
  _id,
  title,
  description,
  order,
  "icon": icon.asset->url
}`;

export const faqsQuery = groq`*[_type == "faq"] | order(order asc) {
  _id,
  question,
  answer,
  order
}`;

export const activeBannersQuery = groq`*[_type == "banner" && isActive == true] | order(order asc) {
  _id,
  title,
  subtitle,
  ctaText,
  ctaLink,
  placement,
  "image": image.asset->url
}`;

export async function getCourses() {
  return client.fetch(coursesQuery);
}

export async function getCourse(slug) {
  return client.fetch(courseBySlugQuery, { slug });
}

export async function getTestimonials() {
  return client.fetch(testimonialsQuery);
}

export async function getVisaServices() {
  return client.fetch(visaServicesQuery);
}

export async function getFAQs() {
  return client.fetch(faqsQuery);
}

export async function getActiveBanners() {
  return client.fetch(activeBannersQuery);
}