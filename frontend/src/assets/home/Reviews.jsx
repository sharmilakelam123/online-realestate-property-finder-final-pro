import React from "react";
import "./Reviews.css";

const reviews = [
  {
    name: "Rahul Kumar",
    location: "Hyderabad",
    rating: 5,
    text: "Very easy to find properties. The property details were clear and useful.",
  },
  {
    name: "Priya Sharma",
    location: "Bangalore",
    rating: 5,
    text: "I liked the simple search experience and the variety of properties available.",
  },
  {
    name: "Arjun Reddy",
    location: "Visakhapatnam",
    rating: 4,
    text: "Good platform for checking properties in different locations.",
  },
];

export default function Reviews() {
  return (
    <section className="reviews-section">
      <div className="reviews-container">
        <div className="reviews-heading">
          <span>What Our Users Say</span>
          <h2>Trusted by Property Seekers</h2>
          <p>
            Real experiences from people exploring properties with RealFinder.
          </p>
        </div>

        <div className="reviews-grid">
          {reviews.map((review, index) => (
            <div className="review-card" key={index}>
              <div className="review-stars">
                {"★".repeat(review.rating)}
                {"☆".repeat(5 - review.rating)}
              </div>

              <p className="review-text">“{review.text}”</p>

              <div className="review-user">
                <div className="review-avatar">
                  {review.name.charAt(0)}
                </div>

                <div>
                  <h3>{review.name}</h3>
                  <span>{review.location}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}