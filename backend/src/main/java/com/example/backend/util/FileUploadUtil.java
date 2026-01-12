package com.example.backend.util;

import com.example.backend.model.FileMetadata;
import com.example.backend.repository.FileRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Optional;

@Component
public class FileUploadUtil {

    @Autowired
    private FileRepository fileRepository;

    public String uploadFileAndSaveToDatabase(MultipartFile file) throws IOException {
        // Code to upload file to a directory

        // Check if the file already exists in the database
        Optional<FileMetadata> existingFileOptional = fileRepository.findByFileName(file.getOriginalFilename());
        if (existingFileOptional.isPresent()) {
            return existingFileOptional.get().getFileName(); // Return the existing file name if it exists
        }

        // Save file metadata to database
        FileMetadata metadata = new FileMetadata();
        metadata.setFileName(file.getOriginalFilename());
        metadata.setFileSize(file.getSize());

        // Save file content to database
        metadata.setFileContent(file.getBytes());

        // Save metadata and content to the database
        metadata = fileRepository.save(metadata);

        return metadata.getFileName(); // Return the file name
    }

    public byte[] getFileContent(String fileName) {
        Optional<FileMetadata> metadata = fileRepository.findByFileName(fileName);
        return metadata.map(FileMetadata::getFileContent).orElse(null);
    }
}
