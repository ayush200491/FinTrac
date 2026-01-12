package com.example.backend.service;

import com.example.backend.model.FileMetadata;
import com.example.backend.repository.FileRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class FileService {

    @Autowired
    private FileRepository fileRepository;

    public FileMetadata getFileMetadata(Long fileId) {
        return fileRepository.findById(fileId).orElse(null);
    }
}
