package algorithm_note.algorithm_note_v2.global.service.impl;

import algorithm_note.algorithm_note_v2.global.service.RedisService;
import algorithm_note.algorithm_note_v2.problem.exception.RedisOperationException;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import java.util.concurrent.TimeUnit;

/**
 * Redis service implementation for hash-based storage operations.
 * Provides concrete implementation of Redis hash operations with error handling.
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class RedisServiceImpl implements RedisService {

    private final RedisTemplate<String, Object> redisTemplate;
    private final ObjectMapper objectMapper;

    private static final String DATA_FIELD = "data";

    @Override
    public <T> void saveToHash(String keyPrefix, String hashKey, T object, long ttl, TimeUnit timeUnit) {
        try {
            String redisKey = buildRedisKey(keyPrefix, hashKey);

            // Store the object in the hash field
            redisTemplate.opsForHash().put(redisKey, DATA_FIELD, object);

            // Set TTL for the entire hash
            redisTemplate.expire(redisKey, ttl, timeUnit);

            log.debug("Successfully saved object to Redis hash with key: {} and TTL: {} {}",
                     redisKey, ttl, timeUnit);

        } catch (Exception e) {
            log.error("Failed to save object to Redis hash with keyPrefix: {}, hashKey: {}",
                     keyPrefix, hashKey, e);
            throw new RedisOperationException("Failed to save object to Redis hash");
        }
    }

    @Override
    public <T> void saveToHash(String keyPrefix, String hashKey, T object) {
        try {
            String redisKey = buildRedisKey(keyPrefix, hashKey);

            // Store the object in the hash field without TTL
            redisTemplate.opsForHash().put(redisKey, DATA_FIELD, object);

            log.debug("Successfully saved object to Redis hash with key: {}", redisKey);

        } catch (Exception e) {
            log.error("Failed to save object to Redis hash with keyPrefix: {}, hashKey: {}",
                     keyPrefix, hashKey, e);
            throw new RedisOperationException("Failed to save object to Redis hash");
        }
    }

    @Override
    public <T> T getFromHash(String keyPrefix, String hashKey, Class<T> clazz) {
        try {
            String redisKey = buildRedisKey(keyPrefix, hashKey);

            Object cachedData = redisTemplate.opsForHash().get(redisKey, DATA_FIELD);

            if (cachedData == null) {
                log.debug("No data found in Redis hash for key: {}", redisKey);
                return null;
            }

            // Convert the cached data to the requested type
            T result = objectMapper.convertValue(cachedData, clazz);

            log.debug("Successfully retrieved object from Redis hash with key: {}", redisKey);
            return result;

        } catch (Exception e) {
            log.error("Failed to retrieve object from Redis hash with keyPrefix: {}, hashKey: {}",
                     keyPrefix, hashKey, e);
            throw new RedisOperationException("Failed to retrieve object from Redis hash");
        }
    }

    @Override
    public boolean deleteFromHash(String keyPrefix, String hashKey) {
        try {
            String redisKey = buildRedisKey(keyPrefix, hashKey);

            Long deletedCount = redisTemplate.opsForHash().delete(redisKey, DATA_FIELD);
            boolean wasDeleted = deletedCount != null && deletedCount > 0;

            log.debug("Delete operation for Redis hash key: {} - Success: {}", redisKey, wasDeleted);
            return wasDeleted;

        } catch (Exception e) {
            log.error("Failed to delete from Redis hash with keyPrefix: {}, hashKey: {}",
                     keyPrefix, hashKey, e);
            throw new RedisOperationException("Failed to delete from Redis hash");
        }
    }

    @Override
    public boolean existsInHash(String keyPrefix, String hashKey) {
        try {
            String redisKey = buildRedisKey(keyPrefix, hashKey);

            Boolean exists = redisTemplate.opsForHash().hasKey(redisKey, DATA_FIELD);
            boolean result = Boolean.TRUE.equals(exists);

            log.debug("Existence check for Redis hash key: {} - Exists: {}", redisKey, result);
            return result;

        } catch (Exception e) {
            log.error("Failed to check existence in Redis hash with keyPrefix: {}, hashKey: {}",
                     keyPrefix, hashKey, e);
            throw new RedisOperationException("Failed to check existence in Redis hash");
        }
    }

    @Override
    public boolean deleteByKeyPrefix(String keyPrefix) {
        try {
            // For hash-based storage, we need to delete the entire hash key
            // In this implementation, keyPrefix is used as the base for building keys
            // We'll delete the key directly if it exists
            Boolean deleted = redisTemplate.delete(keyPrefix);
            boolean wasDeleted = Boolean.TRUE.equals(deleted);

            log.debug("Delete operation for Redis key: {} - Success: {}", keyPrefix, wasDeleted);
            return wasDeleted;

        } catch (Exception e) {
            log.error("Failed to delete Redis key with keyPrefix: {}", keyPrefix, e);
            throw new RedisOperationException("Failed to delete Redis key");
        }
    }

    @Override
    public boolean setTtl(String keyPrefix, long ttl, TimeUnit timeUnit) {
        try {
            Boolean result = redisTemplate.expire(keyPrefix, ttl, timeUnit);
            boolean success = Boolean.TRUE.equals(result);

            log.debug("Set TTL for Redis key: {} - TTL: {} {} - Success: {}",
                     keyPrefix, ttl, timeUnit, success);
            return success;

        } catch (Exception e) {
            log.error("Failed to set TTL for Redis key: {}", keyPrefix, e);
            throw new RedisOperationException("Failed to set TTL for Redis key");
        }
    }

    /**
     * Builds the Redis key from prefix and hash key.
     * For hash-based storage, we use the pattern: keyPrefix:hashKey
     */
    private String buildRedisKey(String keyPrefix, String hashKey) {
        return keyPrefix + hashKey;
    }
}