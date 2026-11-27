package cl.sonidovivo.backend.config;

import cl.sonidovivo.backend.model.Rol;
import cl.sonidovivo.backend.model.Usuario;
import cl.sonidovivo.backend.repository.UsuarioRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class CargaUsuarios implements CommandLineRunner {

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;

    public CargaUsuarios(UsuarioRepository usuarioRepository, PasswordEncoder passwordEncoder) {
        this.usuarioRepository = usuarioRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        crear("Administrador", "admin@sonidovivo.cl", "admin123", Rol.Administrador);
        crear("Vendedor Uno", "vendedor@sonidovivo.cl", "vendedor123", Rol.Vendedor);
        crear("Cliente Prueba", "cliente@sonidovivo.cl", "cliente123", Rol.Cliente);
    }

    private void crear(String nombre, String email, String password, Rol rol) {
        if (usuarioRepository.existsByEmail(email)) {
            return;
        }
        Usuario usuario = new Usuario();
        usuario.setNombre(nombre);
        usuario.setEmail(email);
        usuario.setPassword(passwordEncoder.encode(password));
        usuario.setRol(rol);
        usuario.setActivo(true);
        usuarioRepository.save(usuario);
    }
}