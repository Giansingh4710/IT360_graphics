import pygame
from pygame.locals import DOUBLEBUF, OPENGL
from OpenGL.GL import (
    glOrtho,
    glBegin,
    glEnd,
    glVertex2fv,
    glClear,
    glColor3f,
    glRasterPos2f,
    GL_COLOR_BUFFER_BIT,
    GL_QUADS,
)

from OpenGL.GLUT import glutBitmapCharacter
from OpenGL.GLUT.fonts import GLUT_BITMAP_TIMES_ROMAN_24


def move_paddles():
    keys = pygame.key.get_pressed()
    # move paddles
    speed = 10
    if keys[pygame.K_w] and LEFT_PADDLE_POS[1] > 0:
        LEFT_PADDLE_POS[1] -= speed

    if keys[pygame.K_s] and LEFT_PADDLE_POS[1] < HEIGHT - (PADDLE_HEIGHT // 2):
        LEFT_PADDLE_POS[1] += speed

    if keys[pygame.K_UP] and RIGHT_PADDLE_POS[1] > 0:
        RIGHT_PADDLE_POS[1] -= speed
    if keys[pygame.K_DOWN] and RIGHT_PADDLE_POS[1] < HEIGHT - (PADDLE_HEIGHT // 2):
        RIGHT_PADDLE_POS[1] += speed

    print(WIDTH, HEIGHT)
    print(LEFT_PADDLE_POS, RIGHT_PADDLE_POS)

def check_for_scoring():
    global BALL_POS, RIGHT_SCORE, LEFT_SCORE, PAUSED, HEIGHT, WIDTH
    score_changed = False
    if BALL_POS[0] < 0:
        BALL_POS = [WIDTH // 2, HEIGHT // 2]
        RIGHT_SCORE += 1
        WIDTH -= 50
        score_changed = True
    if BALL_POS[0] > WIDTH:
        BALL_POS = [WIDTH // 2, HEIGHT // 2]
        LEFT_SCORE += 1
        HEIGHT -= 50
        PAUSED = True
        score_changed = True

    if score_changed:
        BALL_VEL[0] = -BALL_VEL[0]
        BALL_VEL[1] = -BALL_VEL[1]
        calculate_size_of_items()
        reset_paddle_pos()
        pygame.display.set_mode((WIDTH, HEIGHT), DOUBLEBUF | OPENGL)

    return score_changed


def update_ball_pos():
    BALL_POS[0] += BALL_VEL[0]
    BALL_POS[1] += BALL_VEL[1]

    # bounce off top and bottom
    if BALL_POS[1] < 0 or BALL_POS[1] > HEIGHT - BALL_SIZE:
        BALL_VEL[1] = -BALL_VEL[1]

    # bounce off paddles
    left_w = LEFT_PADDLE_POS[0] < BALL_POS[0] < LEFT_PADDLE_POS[0] + PADDLE_WIDTH
    left_h = LEFT_PADDLE_POS[1] < BALL_POS[1] < LEFT_PADDLE_POS[1] + PADDLE_HEIGHT
    right_w = RIGHT_PADDLE_POS[0] < BALL_POS[0] < RIGHT_PADDLE_POS[0] + PADDLE_WIDTH
    right_h = RIGHT_PADDLE_POS[1] < BALL_POS[1] < RIGHT_PADDLE_POS[1] + PADDLE_HEIGHT
    if (left_w and left_h) or (right_w and right_h):
        BALL_VEL[0] = -BALL_VEL[0]


def draw_screen():
    glClear(GL_COLOR_BUFFER_BIT)  # Clear the screen

    # Draw paddles and ball
    glBegin(GL_QUADS)
    glVertex2fv(LEFT_PADDLE_POS)
    glVertex2fv([LEFT_PADDLE_POS[0] + PADDLE_WIDTH, LEFT_PADDLE_POS[1]])
    glVertex2fv([LEFT_PADDLE_POS[0] + PADDLE_WIDTH, LEFT_PADDLE_POS[1] + PADDLE_HEIGHT])
    glVertex2fv([LEFT_PADDLE_POS[0], LEFT_PADDLE_POS[1] + PADDLE_HEIGHT])

    glVertex2fv(RIGHT_PADDLE_POS)
    glVertex2fv([RIGHT_PADDLE_POS[0] + PADDLE_WIDTH, RIGHT_PADDLE_POS[1]])
    glVertex2fv(
        [RIGHT_PADDLE_POS[0] + PADDLE_WIDTH, RIGHT_PADDLE_POS[1] + PADDLE_HEIGHT]
    )
    glVertex2fv([RIGHT_PADDLE_POS[0], RIGHT_PADDLE_POS[1] + PADDLE_HEIGHT])

    glVertex2fv([BALL_POS[0], BALL_POS[1]])
    glVertex2fv([BALL_POS[0] + BALL_SIZE, BALL_POS[1]])
    glVertex2fv([BALL_POS[0] + BALL_SIZE, BALL_POS[1] + BALL_SIZE])
    glVertex2fv([BALL_POS[0], BALL_POS[1] + BALL_SIZE])
    glEnd()
    write_text()
    pygame.display.flip()
    pygame.time.Clock().tick(FRAMES_PER_SECOND)


def write_text():
    height_pos = HEIGHT // 2 + 100

    def write_to_screen(text):
        nonlocal height_pos
        glColor3f(190.0, 167.0, 4.0)
        glRasterPos2f((WIDTH - len(text) * 10) // 2, height_pos)
        for char in text:
            glutBitmapCharacter(GLUT_BITMAP_TIMES_ROMAN_24, ord(char))

        height_pos += 30

    write_to_screen(f"Score is {LEFT_SCORE} - {RIGHT_SCORE}")
    write_to_screen("Keys:")
    write_to_screen("Left paddle: W and S")
    write_to_screen("Right paddle: Up and Down")
    write_to_screen(f"Press Space to: {'Play' if PAUSED else 'Pause'}")
    write_to_screen("First to 5 wins!")
    if LEFT_SCORE >= 5 or RIGHT_SCORE >= 5:
        write_to_screen("Game Over")
        write_to_screen("Press R to restart")


def reset_paddle_pos():
    global LEFT_PADDLE_POS, RIGHT_PADDLE_POS
    m = 10
    LEFT_PADDLE_POS = [m, HEIGHT // 2 - PADDLE_HEIGHT // 2]
    RIGHT_PADDLE_POS = [WIDTH - m - PADDLE_WIDTH, HEIGHT // 2 - PADDLE_HEIGHT // 2]


def calculate_size_of_items():
    global PADDLE_WIDTH, PADDLE_HEIGHT
    global BALL_POS, BALL_VEL

    PADDLE_WIDTH = WIDTH // 30
    PADDLE_HEIGHT = HEIGHT // 4
    reset_paddle_pos()
    BALL_POS = [WIDTH // 2, HEIGHT // 2]
    BALL_VEL = [WIDTH // 128, WIDTH // 128]


def reset_game_vars():
    global WIDTH, HEIGHT, FRAMES_PER_SECOND, BALL_SIZE, PAUSED
    global LEFT_SCORE, RIGHT_SCORE

    WIDTH, HEIGHT = 800, 600
    FRAMES_PER_SECOND = 60
    BALL_SIZE = 15
    LEFT_SCORE, RIGHT_SCORE = 0, 0
    # BALL_VEL = [5, 5]
    PAUSED = True
    calculate_size_of_items()
    screen = pygame.display.set_mode((WIDTH, HEIGHT), DOUBLEBUF | OPENGL)


def main():
    global WIDTH, HEIGHT, FRAMES_PER_SECOND
    global PADDLE_WIDTH, PADDLE_HEIGHT, BALL_SIZE, LEFT_PADDLE_POS, RIGHT_PADDLE_POS
    global BALL_POS, BALL_VEL, LEFT_SCORE, RIGHT_SCORE, PAUSED

    while True:
        for event in pygame.event.get():
            if event.type == pygame.QUIT:
                pygame.quit()
            if event.type == pygame.KEYDOWN:
                if event.key == pygame.K_q:
                    pygame.quit()
                if event.key == pygame.K_r:
                    reset_game_vars()
                    draw_screen()
                if event.key == pygame.K_SPACE:
                    if LEFT_SCORE >= 5 or RIGHT_SCORE >= 5:
                        continue
                    PAUSED = not PAUSED
                    draw_screen()

        if not PAUSED:
            move_paddles()
            update_ball_pos()
            changed = check_for_scoring()
            draw_screen()
            if changed:
                PAUSED = True


if __name__ == "__main__":
    pygame.init()

    reset_game_vars()
    glOrtho(0, WIDTH, HEIGHT, 0, -1, 1)
    draw_screen()  # Draw initial screen
    main()
