package com.maisontia.api.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import java.util.List;

public class ProductRequest {

    @NotBlank(message = "Le nom du bijou est obligatoire")
    @Size(min = 2, max = 200, message = "Le nom doit comporter entre 2 et 200 caractères")
    private String name;

    @NotBlank(message = "La catégorie est obligatoire")
    @Pattern(regexp = "^(?i)(gold|silver)$", message = "La catégorie doit être 'gold' (Or) ou 'silver' (Argent)")
    private String category;

    @Size(max = 2000, message = "La description ne peut pas dépasser 2000 caractères")
    private String description;

    @Size(max = 100, message = "Le format du prix est trop long")
    private String price;

    @Size(max = 1000, message = "L'URL de l'image est trop longue")
    private String featuredImage;

    private List<@Size(max = 1000, message = "URL d'image invalide") String> images;

    public ProductRequest() {}

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getPrice() {
        return price;
    }

    public void setPrice(String price) {
        this.price = price;
    }

    public String getFeaturedImage() {
        return featuredImage;
    }

    public void setFeaturedImage(String featuredImage) {
        this.featuredImage = featuredImage;
    }

    public List<String> getImages() {
        return images;
    }

    public void setImages(List<String> images) {
        this.images = images;
    }
}
