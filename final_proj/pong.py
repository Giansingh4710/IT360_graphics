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
    glDrawPixels,
    GL_COLOR_BUFFER_BIT,
    GL_QUADS,
    GL_RGBA,
    GL_UNSIGNED_BYTE,
)

from OpenGL.GLUT import glutBitmapCharacter
from OpenGL.GLUT.fonts import GLUT_BITMAP_TIMES_ROMAN_24


def move_paddles(keys):
    speed = 5
    if keys[pygame.K_w] and LEFT_PADDLE_POS[1] > 0:
        LEFT_PADDLE_POS[1] -= speed
    if keys[pygame.K_s] and LEFT_PADDLE_POS[1] < HEIGHT - PADDLE_HEIGHT:
        LEFT_PADDLE_POS[1] += speed
    if keys[pygame.K_UP] and RIGHT_PADDLE_POS[1] > 0:
        RIGHT_PADDLE_POS[1] -= speed
    if keys[pygame.K_DOWN] and RIGHT_PADDLE_POS[1] < HEIGHT - PADDLE_HEIGHT:
        RIGHT_PADDLE_POS[1] += speed


def bounce_off_walls():
    if BALL_POS[1] < 0 or BALL_POS[1] > HEIGHT - BALL_SIZE:
        BALL_VEL[1] = -BALL_VEL[1]


def check_for_scoring():
    global BALL_POS, RIGHT_SCORE, LEFT_SCORE
    if BALL_POS[0] < 0:
        BALL_POS = [WIDTH // 2, HEIGHT // 2]
        RIGHT_SCORE += 1
    if BALL_POS[0] > WIDTH:
        BALL_POS = [WIDTH // 2, HEIGHT // 2]
        LEFT_SCORE += 1


def bounce_off_paddles():
    left_w = LEFT_PADDLE_POS[0] < BALL_POS[0] < LEFT_PADDLE_POS[0] + PADDLE_WIDTH
    left_h = LEFT_PADDLE_POS[1] < BALL_POS[1] < LEFT_PADDLE_POS[1] + PADDLE_HEIGHT
    right_w = RIGHT_PADDLE_POS[0] < BALL_POS[0] < RIGHT_PADDLE_POS[0] + PADDLE_WIDTH
    right_h = RIGHT_PADDLE_POS[1] < BALL_POS[1] < RIGHT_PADDLE_POS[1] + PADDLE_HEIGHT
    if (left_w and left_h) or (right_w and right_h):
        BALL_VEL[0] = -BALL_VEL[0]


def update_ball_pos():
    BALL_POS[0] += BALL_VEL[0]
    BALL_POS[1] += BALL_VEL[1]


def draw():
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

    # Draw text using glutBitmapCharacter
    glColor3f(1.0, 1.0, 1.0)  # Set text color to white
    text = f"Score is {LEFT_SCORE} - {RIGHT_SCORE}"
    glRasterPos2f((WIDTH - len(text) * 10) // 2, 50)

    for char in text:
        glutBitmapCharacter(GLUT_BITMAP_TIMES_ROMAN_24, ord(char))


def main():
    global WIDTH, HEIGHT, PADDLE_WIDTH, PADDLE_HEIGHT, BALL_SIZE, LEFT_PADDLE_POS, RIGHT_PADDLE_POS, BALL_POS, BALL_VEL
    global FRAMES_PER_SECOND

    while True:
        for event in pygame.event.get():
            if event.type == pygame.QUIT:
                pygame.quit()
                quit()

        keys = pygame.key.get_pressed()
        move_paddles(keys)
        update_ball_pos()
        bounce_off_walls()
        bounce_off_paddles()
        check_for_scoring()

        draw()

        pygame.display.flip()
        pygame.time.Clock().tick(FRAMES_PER_SECOND)


if __name__ == "__main__":
    WIDTH, HEIGHT = 800, 600

    pygame.init()
    screen = pygame.display.set_mode((WIDTH, HEIGHT), DOUBLEBUF | OPENGL)
    glOrtho(0, WIDTH, HEIGHT, 0, -1, 1)

    FRAMES_PER_SECOND = 60
    PADDLE_WIDTH, PADDLE_HEIGHT = 20, 100

    BALL_SIZE = 15

    LEFT_PADDLE_POS = [50, HEIGHT // 2 - PADDLE_HEIGHT // 2]
    RIGHT_PADDLE_POS = [WIDTH - 50 - PADDLE_WIDTH, HEIGHT // 2 - PADDLE_HEIGHT // 2]

    BALL_POS = [WIDTH // 2, HEIGHT // 2]
    BALL_VEL = [5, 5]
    LEFT_SCORE, RIGHT_SCORE = 0, 0

    main()
