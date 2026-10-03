package com.cybersec.tracker.resource.dto;

import com.cybersec.tracker.resource.ResourceKind;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record ResourceRequest(
        @NotBlank @Size(max = 200) String title,
        @Size(max = 500) @Pattern(regexp = "^(https?://.*)?$", message = "must start with http:// or https://") String url,
        @NotNull ResourceKind kind
) {
}
