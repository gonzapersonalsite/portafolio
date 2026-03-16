package com.gonzalomartinez.portfolio_backend.ci;

import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.fail;

class IntentionalFailTest {

    @Test
    void shouldFailForCiGate() {
        fail("Intentional failure to verify CI deploy gate");
    }
}

