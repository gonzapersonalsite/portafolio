package com.gonzalomartinez.portfolio_backend.shared.infrastructure.security;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.NullAndEmptySource;
import org.junit.jupiter.params.provider.ValueSource;

import static org.junit.jupiter.api.Assertions.*;

class InputSanitizerTest {

    private final InputSanitizer sanitizer = new InputSanitizer();

    @Test
    void sanitize_RemovesHtmlTags() {
        String result = sanitizer.sanitize("<p>Hello <b>World</b></p>");
        assertEquals("Hello World", result);
    }

    @Test
    void sanitize_RemovesScriptTags() {
        String result = sanitizer.sanitize("<script>alert('xss')</script>Hello");
        assertEquals("Hello", result);
    }

    @Test
    void sanitize_RemovesScriptTagsCaseInsensitive() {
        String result = sanitizer.sanitize("<SCRIPT>alert('xss')</SCRIPT>Hello");
        assertEquals("Hello", result);
    }

    @Test
    void sanitize_PreservesNewlinesAndTabs() {
        String result = sanitizer.sanitize("Line1\nLine2\tIndented");
        assertEquals("Line1\nLine2\tIndented", result);
    }

    @Test
    void sanitize_TrimsWhitespace() {
        String result = sanitizer.sanitize("  hello  ");
        assertEquals("hello", result);
    }

    @ParameterizedTest
    @NullAndEmptySource
    @ValueSource(strings = {"  ", "\t", "\n"})
    void sanitize_ReturnsInputWhenNullOrBlank(String input) {
        assertEquals(input, sanitizer.sanitize(input));
    }

    @Test
    void containsSqlInjection_DetectsDropTable() {
        String input = "'; DROP TABLE users; --";
        assertTrue(sanitizer.containsSqlInjection(input));
    }

    @Test
    void containsSqlInjection_ReturnsFalseForNormalText() {
        assertFalse(sanitizer.containsSqlInjection("Normal text"));
    }

    @Test
    void containsSqlInjection_ReturnsFalseForNull() {
        assertFalse(sanitizer.containsSqlInjection(null));
    }

    @Test
    void sanitizeUrl_BlocksJavascriptProtocol() {
        assertEquals("", sanitizer.sanitizeUrl("javascript:alert('xss')"));
    }

    @Test
    void sanitizeUrl_BlocksDataProtocol() {
        assertEquals("", sanitizer.sanitizeUrl("data:text/html,<script>alert('xss')</script>"));
    }

    @Test
    void sanitizeUrl_AllowsHttps() {
        String url = "https://example.com";
        assertEquals(url, sanitizer.sanitizeUrl(url));
    }

    @Test
    void sanitizeUrl_TrimsWhitespace() {
        assertEquals("https://example.com", sanitizer.sanitizeUrl("  https://example.com  "));
    }

    @ParameterizedTest
    @NullAndEmptySource
    @ValueSource(strings = {"  "})
    void sanitizeUrl_ReturnsInputWhenNullOrBlank(String input) {
        assertEquals(input, sanitizer.sanitizeUrl(input));
    }
}
