/**
 * Login State Packets for Minecraft 1.8.9
 *
 * @module packets/login
 */

/**
 * Player profile property (skin, cape, etc.).
 * Used in login and play states for profile data.
 */
export interface PlayerProperty {
  /**
   * Property name
   * Possible values: "textures" or other Mojang property names
   */
  name: string;

  /**
   * Property value (base64-encoded)
   * Possible values: base64-encoded string
   */
  value: string;

  /**
   * Signature for verification
   * Possible values: base64-encoded Yggdrasil signature or undefined
   */
  signature?: string;
}

/**
 * Packet: Disconnect (Login)
 * Description: Sent when the server refuses the login attempt.
 * ID: 0x00
 */
export interface DisconnectLoginClientbound {
  /**
   * Disconnect reason as JSON text component
   * Possible values: serialized JSON chat component string
   */
  reason: string;
}

/**
 * Packet: EncryptionBegin (Clientbound)
 * Description: Initiates the encryption handshake for online-mode servers.
 * ID: 0x01
 */
export interface EncryptionBeginClientbound {
  /**
   * Server ID string
   * Possible values: empty string for 1.7+ servers
   */
  serverId: string;

  /**
   * Server's public key (ASN.1 DER encoded)
   * Possible values: DER-encoded RSA public key bytes
   */
  publicKey: Buffer;

  /**
   * Random verify token bytes
   * Possible values: 4 random bytes
   */
  verifyToken: Buffer;
}

/**
 * Packet: LoginSuccess
 * Description: Signals successful login; connection transitions to play state.
 * ID: 0x02
 */
export interface LoginSuccessClientbound {
  /**
   * Player's UUID with hyphens
   * Possible values: UUID string in format "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
   */
  uuid: string;

  /**
   * Player's username
   * Possible values: 1-16 character username string
   */
  username: string;
}

/**
 * Packet: SetCompression (Login)
 * Description: Enables packet compression above the specified threshold.
 * Sent before Login Success if compression is enabled.
 * ID: 0x03
 */
export interface CompressClientbound {
  /**
   * Minimum packet size to compress
   * Possible values: -1 (disable) or positive integer threshold in bytes
   */
  threshold: number;
}

/**
 * Packet: LoginStart
 * Description: First packet in login state; contains the player's username.
 * ID: 0x00
 */
export interface LoginStartServerbound {
  /**
   * Player's username
   * Possible values: 1-16 character username string
   */
  username: string;
}

/**
 * Packet: EncryptionBegin (Serverbound)
 * Description: Client's response to the encryption request with encrypted secrets.
 * ID: 0x01
 */
export interface EncryptionBeginServerbound {
  /**
   * Shared secret encrypted with server's public key
   * Possible values: RSA-encrypted shared secret bytes
   */
  sharedSecret: Buffer;

  /**
   * Verify token encrypted with server's public key
   * Possible values: RSA-encrypted verify token bytes
   */
  verifyToken: Buffer;
}

