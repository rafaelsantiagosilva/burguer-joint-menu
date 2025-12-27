export default interface IStorageProvider {
  save(buffer: Buffer, filePath: string): Promise<string>;
  delete(filePath: string): Promise<void>;
}