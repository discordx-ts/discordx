export interface InitCommandConfig {
  /**
   * Enable console log
   */
  log?: boolean;
  /**
   * Disable specific actions
   */
  disable?: {
    /**
     * Disable the add operation, which registers application commands with Discord
     */
    add?: boolean;
    /**
     * Disable the update operation, which update application commands with Discord
     */
    update?: boolean;
    /**
     * Disable the delete operation, which unregisters application commands with Discord
     */
    delete?: boolean;
    /**
     * Disable the permission operation, which updates application commands permissions with Discord
     */
    permission?: boolean;
  };
}
