package com.example.backend.model;

import java.util.Locale;

public enum ExpenseCategory {
    FOOD("Food & Dining"),
    TRAVEL("Travel"),
    RENT("Rent & Housing"),
    SHOPPING("Shopping"),
    BILLS("Bills & Utilities"),
    ENTERTAINMENT("Entertainment"),
    HEALTHCARE("Healthcare"),
    EDUCATION("Education"),
    TRANSPORT("Transportation"),
    OTHER("Other");

    private final String displayName;

    ExpenseCategory(String displayName) {
        this.displayName = displayName;
    }

    public String getDisplayName() {
        return displayName;
    }

    public static ExpenseCategory fromString(String value) {
        if (value == null || value.isBlank()) {
            return OTHER;
        }

        String normalized = value.trim().toUpperCase(Locale.ROOT)
                .replace("&", "AND")
                .replaceAll("[^A-Z0-9]+", "_")
                .replaceAll("_+", "_")
                .replaceAll("^_|_$", "");

        switch (normalized) {
            case "FOOD":
            case "FOOD_DINING":
                return FOOD;
            case "TRAVEL":
                return TRAVEL;
            case "RENT":
            case "HOUSING":
            case "RENT_HOUSING":
                return RENT;
            case "SHOPPING":
                return SHOPPING;
            case "BILLS":
            case "UTILITIES":
            case "BILLS_UTILITIES":
                return BILLS;
            case "ENTERTAINMENT":
                return ENTERTAINMENT;
            case "HEALTHCARE":
                return HEALTHCARE;
            case "EDUCATION":
                return EDUCATION;
            case "TRANSPORT":
            case "TRANSPORTATION":
                return TRANSPORT;
            case "OTHER":
                return OTHER;
            default:
                break;
        }

        try {
            return ExpenseCategory.valueOf(normalized);
        } catch (IllegalArgumentException e) {
            return OTHER;
        }
    }
}
