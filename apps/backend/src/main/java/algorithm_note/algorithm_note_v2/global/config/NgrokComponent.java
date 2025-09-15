package algorithm_note.algorithm_note_v2.global.config;

import com.github.alexdlaird.ngrok.NgrokClient;
import com.github.alexdlaird.ngrok.protocol.CreateTunnel;
import com.github.alexdlaird.ngrok.protocol.Tunnel;
import jakarta.annotation.PostConstruct;
import jakarta.annotation.PreDestroy;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Slf4j
@Component
public class NgrokComponent {

  @Value("${server.port}")
  private int serverPort;

  private NgrokClient ngrokClient;

  @PostConstruct
  public void startNgrok() {
    log.info("Starting ngrok tunnel for port {}...", serverPort);
    ngrokClient = new NgrokClient.Builder().build();

    // CreateTunnel 빌더를 사용해 포트를 명시적으로 지정하는 것이 더 안전합니다.
    final CreateTunnel createTunnel = new CreateTunnel.Builder()
        .withAddr(serverPort)
        .build();

    final Tunnel tunnel = ngrokClient.connect(createTunnel);
    String publicUrl = tunnel.getPublicUrl();

    log.info("****************************************************************");
    log.info("  ngrok tunnel started successfully!");
    log.info("  Public URL: {}", publicUrl);
    log.info("  Copy this URL to your Clerk Webhook endpoint configuration.");
    log.info("****************************************************************");
  }

  @PreDestroy
  public void stopNgrok() {
    if (ngrokClient != null) {
      ngrokClient.kill();
      log.info("ngrok client closed.");
    }
  }
}