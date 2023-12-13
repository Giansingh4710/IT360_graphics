import pygame


pygame.init()
res = (720, 720)  # screen resolution
screen = pygame.display.set_mode(res)  # opens up a window
color = (255, 255, 255)  # white color
color_light = (170, 170, 170)  # light shade of the button
color_dark = (100, 100, 100)  # dark shade of the button

width = screen.get_width()
height = screen.get_height()

smallfont = pygame.font.SysFont("Corbel", 40)
text = smallfont.render("quit", True, color)

while True:
    mouse = pygame.mouse.get_pos()
    for ev in pygame.event.get():
        if ev.type == pygame.QUIT:
            pygame.quit()
        if ev.type == pygame.MOUSEBUTTONDOWN:
            # if the mouse is clicked on the
            # button the game is terminated
            if ( width / 2 <= mouse[0] <= width / 2 + 140 and height / 2 <= mouse[1] <= height / 2 + 40):
                pygame.quit()

    screen.fill((60, 25, 60))  # fills the screen with a color

    # if mouse is hovered on a button it
    # changes to lighter shade
    if ( width / 2 <= mouse[0] <= width / 2 + 140 and height / 2 <= mouse[1] <= height / 2 + 40):
        pygame.draw.rect(screen, color_light, [width / 2, height / 2, 140, 40])
    else:
        pygame.draw.rect(screen, color_dark, [width / 2, height / 2, 140, 40])

    # superimposing the text onto our button
    screen.blit(text, (width / 2 + 50, height / 2))

    # updates the frames of the game
    pygame.display.update()
