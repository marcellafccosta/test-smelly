const { UserService } = require ('../src/userService');

const dadosUsuarioPadrao = {
  nome: 'Fulano de Tal',
  email: 'fulano@teste.com',
  idade: 25,
};

describe('UserService - Testes Refatorados', () => {
  let userService;

  // O setup é executado antes de cada teste
  beforeEach(() => {
    userService = new UserService();
    userService._clearDB(); // Limpa o "banco" para cada teste
  });

  describe('createUser', () => {
    test('deve criar um usuário corretamente', () => {
    // Arrange
    const { nome, email, idade } = dadosUsuarioPadrao;

    // Act
    const usuarioCriado = userService.createUser(nome, email, idade);

    // Assert
    expect(usuarioCriado.nome).toBe(nome);
    expect(usuarioCriado.email).toBe(email);
    expect(usuarioCriado.idade).toBe(idade);
  });

    test('deve criar um usuario com status ativo por padrão', () => {
    // Arrange
    const { nome, email, idade } = dadosUsuarioPadrao;

    // Act
    const usuarioCriado = userService.createUser(nome, email, idade);

    // Assert
    expect(usuarioCriado.status).toBe('ativo');
  });

    test('deve lançar erro ao criar usuário menor de idade', () => {
    // Arrange
    const { nome, email } = dadosUsuarioPadrao;
    const idadeInvalida = 17;

    // Act & Assert
    expect(() => {
      userService.createUser(nome, email, idadeInvalida);
    }).toThrow('O usuário deve ser maior de idade.');
  });

  });

  describe('getUserById', () => {
    test('deve buscar um usuário pelo ID corretamente', () => {
      // Arrange
      const { nome, email, idade } = dadosUsuarioPadrao;
      const usuarioCriado = userService.createUser(nome, email, idade);

        // Act
        const usuarioBuscado = userService.getUserById(usuarioCriado.id);

      // Assert
      expect(usuarioBuscado.nome).toBe(nome);
      expect(usuarioBuscado.email).toBe(email);
      expect(usuarioBuscado.status).toBe('ativo');
    });

    test('deve retornar null para ID inexistente', () => {
        // Arrange
        const idInexistente = 'id-que-nao-existe';

        // Act
        const usuarioBuscado = userService.getUserById(idInexistente);

        // Assert
        expect(usuarioBuscado).toBeNull();
    });
  });


  describe('deactivateUser', () => {
    test('deve retornar true ao desativar um usuário comum', () => {
        // Arrange
        const usuarioComum = userService.createUser('Comum', 'comum@teste.com', 30);

        // Act
        const resultado = userService.deactivateUser(usuarioComum.id);

        // Assert
        expect(resultado).toBe(true);

    });

    test('deve alterar status para inativo ao desativar um usuário comum', () => {
        // Arrange
        const usuarioComum = userService.createUser('Comum', 'comum@teste.com', 30);

        // Act
        userService.deactivateUser(usuarioComum.id);
        const usuarioAtualizado = userService.getUserById(usuarioComum.id);

        // Assert
        expect(usuarioAtualizado.status).toBe('inativo');
    });

    test('deve retornar false ao tentar desativar um administrador', () => {
        // Arrange
        const usuarioAdmin = userService.createUser('Admin', 'admin@teste.com', 40, true);

        // Act
        const resultado = userService.deactivateUser(usuarioAdmin.id);

        // Assert
        expect(resultado).toBe(false);
    });
    test('deve manter status ativo ao tentar desativar um administrador', () => {
        // Arrange
        const usuarioAdmin = userService.createUser('Admin', 'admin@teste.com', 40, true);

        // Act
        userService.deactivateUser(usuarioAdmin.id);
        const usuarioAtualizado = userService.getUserById(usuarioAdmin.id);

        // Assert
        expect(usuarioAtualizado.status).toBe('ativo');
    });
  });

  describe('generateUserReport', () => {
        test('deve incluir titulo no relatório', () => {
            // Arrange
            userService.createUser('Alice', 'alice@email.com', 28);

            // Act
            const relatorio = userService.generateUserReport();

            // Assert
            expect(relatorio).toContain('Relatório de Usuários');
        });

        test('deve incluir nome do usuario no relatório', () => {
            // Arrange
            const nomeUsuario = 'Alice';
            userService.createUser(nomeUsuario, 'alice@email.com', 28);

            // Act
            const relatorio = userService.generateUserReport();

            // Assert
            expect(relatorio).toContain(nomeUsuario);
        });

        test('deve incluir status do usuario no relatório', () => {
            // Arrange
            const nomeUsuario = 'Alice';
            userService.createUser(nomeUsuario, 'alice@email.com', 28);

            // Act
            const relatorio = userService.generateUserReport();

            // Assert
            expect(relatorio).toContain('ativo');
        });

        test('deve incluir todos os usuários no relatório', () => {
            // Arrange
            const usuario1 = userService.createUser('Alice', 'alice@email.com', 28);
            const usuario2 = userService.createUser('Bob', 'bob@email.com', 32);

            // Act
            const relatorio = userService.generateUserReport();

            // Assert
            expect(relatorio).toContain(usuario1.nome);
            expect(relatorio).toContain(usuario2.nome);
        });
  });
});