package com.example.backend.controller;

import com.example.backend.model.FileMetadata;
import com.example.backend.service.FileService;
import com.example.backend.service.FileStorageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;

import java.io.IOException;

@Controller
@RequestMapping("/files")
public class FileController {

    @Autowired
    private FileService fileService;

    @Autowired
    private FileStorageService fileStorageService;

    @GetMapping("/{fileId}")
    public ResponseEntity<Resource> downloadFile(@PathVariable Long fileId) throws IOException {
        // Retrieve file metadata
        FileMetadata fileMetadata = fileService.getFileMetadata(fileId);
        if (fileMetadata == null) {
            return ResponseEntity.notFound().build();
        }

        // Read file content from file system
        Resource fileResource = fileStorageService.loadFileAsResource(fileMetadata.getFileName());
        if (fileResource == null) {
            return ResponseEntity.notFound().build();
        }

        // Return the file as a ResponseEntity
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + fileMetadata.getFileName() + "\"")
                .body(fileResource);
    }
}
