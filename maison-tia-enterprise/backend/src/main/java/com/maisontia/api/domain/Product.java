package com.maisontia.api.domain;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "products")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Product {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String category; // gold, silver

    @Column(columnDefinition = "TEXT")
    private String description;

    private String price;

    @Column(name = "featured_image")
    private String featuredImage;

    @ElementCollection
    @CollectionTable(name = "product_images", joinColumns = @JoinColumn(name = "product_id"))
    @Column(name = "image_url")
    private java.util.List<String> images;

    // Explicit Setters for Maven/Compiler compatibility
    public void setName(String name) { this.name = name; }
    public void setCategory(String category) { this.category = category; }
    public void setDescription(String description) { this.description = description; }
    public void setPrice(String price) { this.price = price; }
    public void setFeaturedImage(String featuredImage) { this.featuredImage = featuredImage; }
    public void setImages(java.util.List<String> images) { this.images = images; }

    // Explicit Getters for Maven/Compiler compatibility
    public String getName() { return name; }
    public String getCategory() { return category; }
    public String getDescription() { return description; }
    public String getPrice() { return price; }
    public String getFeaturedImage() { return featuredImage; }
    public java.util.List<String> getImages() { return images; }
}
