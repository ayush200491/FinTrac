package com.example.backend.model;

import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

@Converter(autoApply = false)
public class ExpenseCategoryConverter implements AttributeConverter<ExpenseCategory, String> {

    @Override
    public String convertToDatabaseColumn(ExpenseCategory attribute) {
        return attribute == null ? ExpenseCategory.OTHER.name() : attribute.name();
    }

    @Override
    public ExpenseCategory convertToEntityAttribute(String dbData) {
        return ExpenseCategory.fromString(dbData);
    }
}