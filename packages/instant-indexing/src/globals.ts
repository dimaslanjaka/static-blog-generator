export interface Key {
  client_email: string;
  private_key: string;
}

export interface ServiceConfig extends Key {
  keyFile: string;
}
