package algorithm_note.algorithm_note_v2.global.service;

import java.util.concurrent.TimeUnit;

/**
 * Redis service interface for hash-based storage operations.
 * Provides a generic abstraction layer over Redis hash operations.
 */
public interface RedisService {

    /**
     * Saves an object to Redis hash with TTL.
     *
     * @param keyPrefix The prefix for the Redis key
     * @param hashKey The hash key within the Redis hash
     * @param object The object to store
     * @param ttl Time to live value
     * @param timeUnit Time unit for TTL
     * @param <T> Type of the object
     */
    <T> void saveToHash(String keyPrefix, String hashKey, T object, long ttl, TimeUnit timeUnit);

    /**
     * Saves an object to Redis hash without TTL.
     *
     * @param keyPrefix The prefix for the Redis key
     * @param hashKey The hash key within the Redis hash
     * @param object The object to store
     * @param <T> Type of the object
     */
    <T> void saveToHash(String keyPrefix, String hashKey, T object);

    /**
     * Retrieves an object from Redis hash.
     *
     * @param keyPrefix The prefix for the Redis key
     * @param hashKey The hash key within the Redis hash
     * @param clazz The class type to deserialize to
     * @param <T> Type of the object
     * @return The retrieved object or null if not found
     */
    <T> T getFromHash(String keyPrefix, String hashKey, Class<T> clazz);

    /**
     * Deletes a specific hash key from Redis hash.
     *
     * @param keyPrefix The prefix for the Redis key
     * @param hashKey The hash key within the Redis hash
     * @return true if the key was deleted, false if it didn't exist
     */
    boolean deleteFromHash(String keyPrefix, String hashKey);

    /**
     * Checks if a hash key exists in Redis hash.
     *
     * @param keyPrefix The prefix for the Redis key
     * @param hashKey The hash key within the Redis hash
     * @return true if the key exists, false otherwise
     */
    boolean existsInHash(String keyPrefix, String hashKey);

    /**
     * Deletes an entire Redis hash by key prefix.
     *
     * @param keyPrefix The prefix for the Redis key
     * @return true if the key was deleted, false if it didn't exist
     */
    boolean deleteByKeyPrefix(String keyPrefix);

    /**
     * Sets TTL for a Redis key.
     *
     * @param keyPrefix The prefix for the Redis key
     * @param ttl Time to live value
     * @param timeUnit Time unit for TTL
     * @return true if TTL was set successfully
     */
    boolean setTtl(String keyPrefix, long ttl, TimeUnit timeUnit);
}