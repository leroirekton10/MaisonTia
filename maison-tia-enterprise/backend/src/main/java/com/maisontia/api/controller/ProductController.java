package com.maisontia.api.controller;

import com.maisontia.api.domain.Product;
import com.maisontia.api.dto.ProductRequest;
import com.maisontia.api.security.InputSanitizer;
import com.maisontia.api.service.ProductService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/products")
@CrossOrigin(origins = {"https://www.maisontia.com", "http://localhost:5173"})
public class ProductController {
    private final ProductService productService;

    public ProductController(ProductService productService) {
        this.productService = productService;
    }

    @GetMapping
    public ResponseEntity<List<Product>> getAllProducts() {
        return ResponseEntity.ok(productService.getAllProducts());
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getProductById(@PathVariable Long id) {
        if (id == null || id <= 0) {
            return ResponseEntity.badRequest().body(Map.of("error", "Bad Request", "message", "ID de produit invalide"));
        }
        return productService.getProductById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/upload")
    public ResponseEntity<Map<String, String>> uploadFile(@RequestParam("file") MultipartFile file) {
        String url = productService.uploadFile(file);
        return ResponseEntity.ok(Map.of("url", url));
    }

    @PostMapping
    public ResponseEntity<Product> createProduct(@Valid @RequestBody ProductRequest request) {
        Product product = mapAndSanitize(request);
        return ResponseEntity.ok(productService.createProduct(product));
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateProduct(@PathVariable Long id, @Valid @RequestBody ProductRequest request) {
        if (id == null || id <= 0) {
            return ResponseEntity.badRequest().body(Map.of("error", "Bad Request", "message", "ID de produit invalide"));
        }
        Product product = mapAndSanitize(request);
        return ResponseEntity.ok(productService.updateProduct(id, product));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteProduct(@PathVariable Long id) {
        if (id == null || id <= 0) {
            return ResponseEntity.badRequest().body(Map.of("error", "Bad Request", "message", "ID de produit invalide"));
        }
        productService.deleteProduct(id);
        return ResponseEntity.noContent().build();
    }

    private Product mapAndSanitize(ProductRequest request) {
        Product product = new Product();
        product.setName(InputSanitizer.sanitize(request.getName()));
        product.setCategory(InputSanitizer.sanitize(request.getCategory()).toLowerCase());
        product.setDescription(InputSanitizer.sanitize(request.getDescription()));
        product.setPrice(InputSanitizer.sanitize(request.getPrice()));

        String featuredImage = request.getFeaturedImage();
        if (featuredImage != null && InputSanitizer.isValidSafeUrl(featuredImage)) {
            product.setFeaturedImage(featuredImage.trim());
        }

        if (request.getImages() != null) {
            List<String> safeImages = new ArrayList<>();
            for (String img : request.getImages()) {
                if (img != null && InputSanitizer.isValidSafeUrl(img)) {
                    safeImages.add(img.trim());
                }
            }
            product.setImages(safeImages);
        }
        return product;
    }
}

