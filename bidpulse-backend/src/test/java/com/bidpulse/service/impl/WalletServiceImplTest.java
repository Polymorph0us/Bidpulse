package com.bidpulse.service.impl;

import com.bidpulse.model.User;
import com.bidpulse.model.Wallet;
import com.bidpulse.repository.PaymentTransactionRepository;
import com.bidpulse.repository.WalletRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.web.server.ResponseStatusException;

import java.math.BigDecimal;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class WalletServiceImplTest {

    @Mock
    private WalletRepository walletRepository;

    @Mock
    private PaymentTransactionRepository paymentTransactionRepository;

    @InjectMocks
    private WalletServiceImpl walletService;

    private Wallet mockWallet;
    private User mockUser;

    @BeforeEach
    void setUp() {
        mockUser = new User();
        mockUser.setId(1L);

        mockWallet = new Wallet();
        mockWallet.setId(1L);
        mockWallet.setUser(mockUser);
        mockWallet.setBalance(new BigDecimal("1000.00"));
        mockWallet.setReservedAmount(new BigDecimal("0.00"));
    }

    @Test
    void deposit_ValidAmount_IncreasesBalance() {
        // Arrange
        when(walletRepository.findByUserIdForUpdate(1L)).thenReturn(Optional.of(mockWallet));

        // Act
        walletService.deposit(1L, new BigDecimal("500.00"));

        // Assert
        assertEquals(new BigDecimal("1500.00"), mockWallet.getBalance());
        verify(walletRepository).save(mockWallet);
        verify(paymentTransactionRepository).save(any());
    }

    @Test
    void deposit_InvalidAmount_ThrowsException() {
        // Act & Assert
        assertThrows(ResponseStatusException.class, () -> {
            walletService.deposit(1L, new BigDecimal("-100.00"));
        });
        verify(walletRepository, never()).save(any());
    }

    @Test
    void reserve_SufficientFunds_UpdatesReservedAmount() {
        // Arrange
        when(walletRepository.findByUserIdForUpdate(1L)).thenReturn(Optional.of(mockWallet));

        // Act
        walletService.reserve(1L, new BigDecimal("200.00"), 101L);

        // Assert
        assertEquals(new BigDecimal("1000.00"), mockWallet.getBalance());
        assertEquals(new BigDecimal("200.00"), mockWallet.getReservedAmount());
        verify(walletRepository).save(mockWallet);
        verify(paymentTransactionRepository).save(any());
    }

    @Test
    void reserve_InsufficientFunds_ThrowsException() {
        // Arrange
        when(walletRepository.findByUserIdForUpdate(1L)).thenReturn(Optional.of(mockWallet));

        // Act & Assert
        assertThrows(ResponseStatusException.class, () -> {
            walletService.reserve(1L, new BigDecimal("1200.00"), 101L);
        });
        verify(walletRepository, never()).save(any());
    }

    @Test
    void release_ValidAmount_DecreasesReservedAmount() {
        // Arrange
        mockWallet.setReservedAmount(new BigDecimal("300.00"));
        when(walletRepository.findByUserIdForUpdate(1L)).thenReturn(Optional.of(mockWallet));

        // Act
        walletService.release(1L, new BigDecimal("200.00"), 101L);

        // Assert
        assertEquals(new BigDecimal("100.00"), mockWallet.getReservedAmount());
        verify(walletRepository).save(mockWallet);
        verify(paymentTransactionRepository).save(any());
    }

    @Test
    void chargeReserved_ValidAmount_DecreasesBalanceAndReserved() {
        // Arrange
        mockWallet.setReservedAmount(new BigDecimal("500.00"));
        when(walletRepository.findByUserIdForUpdate(1L)).thenReturn(Optional.of(mockWallet));

        // Act
        walletService.chargeReserved(1L, new BigDecimal("500.00"), 101L);

        // Assert
        assertEquals(new BigDecimal("500.00"), mockWallet.getBalance());
        assertEquals(new BigDecimal("0.00"), mockWallet.getReservedAmount());
        verify(walletRepository).save(mockWallet);
        verify(paymentTransactionRepository).save(any());
    }
}
