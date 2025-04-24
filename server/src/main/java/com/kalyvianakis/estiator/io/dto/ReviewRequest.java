package com.kalyvianakis.estiator.io.dto;

public class ReviewRequest {
    private String review;
    private Integer rating;

    public String getReview() {
        return review;
    }

    public void setReview(String review) {
        this.review = review;
    }

    public Integer getRating() {
        return rating;
    }

    public void setRating(Integer rating) {
        this.rating = rating;
    }
}
