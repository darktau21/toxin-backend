import { createMock } from '@golevelup/ts-jest';
import { Test, TestingModule } from '@nestjs/testing';

import { PublicUserController } from '~/user/public-user.controller';

describe('UserController', () => {
  let controller: PublicUserController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PublicUserController],
    })
      .useMocker(createMock)
      .compile();

    controller = module.get(PublicUserController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
