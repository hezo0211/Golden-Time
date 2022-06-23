import { SetMetadata } from '@nestjs/common';

function MustActive() {
  return SetMetadata('mustActive', true);
}
export default MustActive;
