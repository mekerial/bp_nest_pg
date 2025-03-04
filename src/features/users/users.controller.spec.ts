import { Test, TestingModule } from "@nestjs/testing";
import { CreateUserInputType } from "./types/create-user-input.type";
import { UsersController } from "./users.controller";
import { UsersService } from "./users.service";
import { UsersQueryRepo } from "./repositories/users.queryRepo";

const createUserDto: CreateUserInputType = {
  login: "login #1",
  password: "password #1",
  email: "email #1",
};

describe("UsersController", () => {
  let usersController: UsersController;
  let usersService: UsersService;
  let usersQueryRepo: UsersQueryRepo;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        UsersService,
        {
          provide: UsersService,
          useValue: {
            create: jest
              .fn()
              .mockImplementation((user: CreateUserInputType) =>
                Promise.resolve({ id: "1", ...user }),
              ),
            findAll: jest.fn().mockResolvedValue([
              {
                firstName: "firstName #1",
                lastName: "lastName #1",
              },
              {
                firstName: "firstName #2",
                lastName: "lastName #2",
              },
            ]),
            findOne: jest.fn().mockImplementation((id: string) =>
              Promise.resolve({
                firstName: "firstName #1",
                lastName: "lastName #1",
                id,
              }),
            ),
            remove: jest.fn(),
          },
        },
      ],
    }).compile();

    usersController = app.get<UsersController>(UsersController);
    usersService = app.get<UsersService>(UsersService);
  });

  it("should be defined", () => {
    expect(usersController).toBeDefined();
  });

  describe("create()", () => {
    it("should create a user", () => {
      usersController.create(createUserDto);
      expect(usersController.create(createUserDto)).resolves.toEqual({
        id: "1",
        ...createUserDto,
      });
      expect(usersService.create).toHaveBeenCalledWith(createUserDto);
    });
  });

  describe("findAll()", () => {
    it("should find all users ", () => {
      usersController.findAll({});
      expect(usersQueryRepo.find({})).toHaveBeenCalled();
    });
  });

  describe("findOne()", () => {
    it("should find a user", () => {
      expect(usersController.findOne(1)).resolves.toEqual({
        firstName: "firstName #1",
        lastName: "lastName #1",
        id: 1,
      });
      expect(usersQueryRepo.findOne).toHaveBeenCalled();
    });
  });

  describe("remove()", () => {
    it("should remove the user", () => {
      usersController.remove("2");
      expect(usersService.remove).toHaveBeenCalled();
    });
  });
});
