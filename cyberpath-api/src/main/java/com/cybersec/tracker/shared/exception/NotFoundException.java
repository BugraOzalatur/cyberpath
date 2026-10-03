package com.cybersec.tracker.shared.exception;

public class NotFoundException extends RuntimeException {

    public NotFoundException(String resource, Long id) {
        super(resource + " not found: " + id);
    }
}
