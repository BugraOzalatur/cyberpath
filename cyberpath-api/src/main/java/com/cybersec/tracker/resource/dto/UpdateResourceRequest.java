package com.cybersec.tracker.resource.dto;

import com.cybersec.tracker.resource.ResourceKind;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

/** Only the provided (non-null) fields are updated. */
public record UpdateResourceRequest(
        @Size(max = 200) String title,
        @Size(max = 500) @Pattern(regexp = "^(https?://.*)?$", message = "must start with http:// or https://") String url,
        ResourceKind kind,
        Boolean done
) {
}
