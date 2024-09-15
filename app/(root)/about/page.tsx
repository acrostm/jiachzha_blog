import Link from "next/link";

import { Button } from "@/components/ui/button";

import {
  IconBrandGithub,
  IconLogoGoogle,
  IconLogoVscodeDark,
  IconLogoVscodeLight,
  IconLogoWebstormDark,
  IconLogoWebstormLight,
  IconLogoZshDark,
  IconLogoZshLight,
  IconSkillCSS,
  IconSkillDebianDark,
  IconSkillDebianLight,
  IconSkillDocker,
  IconSkillFigmaDark,
  IconSkillFigmaLight,
  IconSkillHTML,
  IconSkillJavaDark,
  IconSkillJavaLight,
  IconSkillJavaScript,
  IconSkillMybatisDark,
  IconSkillMybatisLight,
  IconSkillMysqlDark,
  IconSkillMysqlLight,
  IconSkillNestjsDark,
  IconSkillNestjsLight,
  IconSkillNextjsDark,
  IconSkillNextjsLight,
  IconSkillNginx,
  IconSkillNodejsDark,
  IconSkillNodejsLight,
  IconSkillPrisma,
  IconSkillReactDark,
  IconSkillReactLight,
  IconSkillRedisDark,
  IconSkillRedisLight,
  IconSkillSpringDark,
  IconSkillSpringLight,
  IconSkillStackoverflowDark,
  IconSkillStackoverflowLight,
  IconSkillTailwindcssDark,
  IconSkillTailwindcssLight,
  IconSkillTypeScript,
  IconSkillUbuntuDark,
  IconSkillUbuntuLight,
} from "@/components/icons";

import { socialMediaList } from "@/features/home";

export const revalidate = 60;

export default function Page() {
  let delay = 0;

  // 每次调用，增加延时
  const getDelay = () => (delay += 200);

  return (
    <div className="flex w-full flex-col justify-center px-6 pb-24 pt-8">
      <section className="prose prose-neutral mx-auto max-w-screen-wrapper dark:prose-invert">
        <h2 className="text-3xl font-bold md:text-4xl">关于</h2>
        <div
          className="animate-fade-up animate-ease-in-out"
          style={{
            animationDelay: `${getDelay()}ms`,
          }}
        >
          <h2>我是谁</h2>
          <p>
            Hi, 我是Jiachen
            ，一名软件开发工程师，2021年毕业，通信行业工作一年，主要做设备Linux系统嵌入式软开，目前自学前后端开发中~~~
          </p>
        </div>

        <div
          className="animate-fade-up animate-ease-in-out"
          style={{
            animationDelay: `${getDelay()}ms`,
          }}
        >
          <h2>我的技能</h2>
        </div>

        <div
          className="animate-fade-up animate-ease-in-out"
          style={{
            animationDelay: `${getDelay()}ms`,
          }}
        >
          <h3>前端</h3>
          <ul>
            <li>
              <IconSkillHTML className="mx-1 translate-y-0.5" /> HTML +
              <IconSkillCSS className="mx-1 translate-y-0.5" />
              CSS + <IconSkillJavaScript className="mx-1 translate-y-0.5" />
              JavaScript
            </li>
            <li>
              <IconSkillTypeScript className="mx-1 translate-y-0.5" />
              TypeScript +
              <>
                <IconSkillReactDark className="mx-1 translate-y-0.5 dark:hidden" />
                <IconSkillReactLight className="mx-1 hidden translate-y-0.5 dark:inline-block" />
              </>
              React +
              <>
                <IconSkillNextjsDark className="mx-1 translate-y-0.5 dark:hidden" />
                <IconSkillNextjsLight className="mx-1 hidden translate-y-0.5 dark:inline-block" />
              </>
              Next.js +
              <>
                <IconSkillTailwindcssDark className="mx-1 translate-y-0.5 dark:hidden" />
                <IconSkillTailwindcssLight className="mx-1 hidden translate-y-0.5 dark:inline-block" />
              </>
              Tailwind CSS，学习中
            </li>
          </ul>
        </div>
        <div
          className="animate-fade-up animate-ease-in-out"
          style={{
            animationDelay: `${getDelay()}ms`,
          }}
        >
          <h3>后端</h3>
          <ul>
            <li>
              <>
                <IconSkillJavaDark className="mx-1 translate-y-0.5 dark:hidden" />
                <IconSkillJavaLight className="mx-1 hidden translate-y-0.5 dark:inline-block" />
              </>
              Java +
              <>
                <IconSkillSpringDark className="mx-1 translate-y-0.5 dark:hidden" />
                <IconSkillSpringLight className="mx-1 hidden translate-y-0.5 dark:inline-block" />
              </>
              Spring Boot +
              <>
                <IconSkillRedisDark className="mx-1 translate-y-0.5 dark:hidden" />
                <IconSkillRedisLight className="mx-1 hidden translate-y-0.5 dark:inline-block" />
              </>
              Redis +
              <>
                <IconSkillMybatisDark className="mx-1 inline-block translate-y-0.5 dark:hidden" />
                <IconSkillMybatisLight className="mx-1 hidden translate-y-0.5 dark:inline-block" />
              </>
              MyBatis，学习中
            </li>
            <li>
              <>
                <IconSkillNodejsDark className="mx-1 translate-y-0.5 dark:hidden" />
                <IconSkillNodejsLight className="mx-1 hidden translate-y-0.5 dark:inline-block" />
              </>
              Node.js +
              <>
                <IconSkillNestjsDark className="mx-1 translate-y-0.5 dark:hidden" />
                <IconSkillNestjsLight className="mx-1 hidden translate-y-0.5 dark:inline-block" />
              </>
              Nest.js，学习中
            </li>
            <li>
              <>
                <IconSkillNextjsDark className="mx-1 translate-y-0.5 dark:hidden" />
                <IconSkillNextjsLight className="mx-1 hidden translate-y-0.5 dark:inline-block" />
              </>
              Next.js + <IconSkillPrisma className="mx-1 translate-y-0.5" />
              Prisma +
              <>
                <IconSkillMysqlDark className="mx-1 translate-y-0.5 dark:hidden" />
                <IconSkillMysqlLight className="mx-1 hidden translate-y-0.5 dark:inline-block" />
              </>
              MySQL，学习中
            </li>
          </ul>
        </div>
        <div
          className="animate-fade-up animate-ease-in-out"
          style={{
            animationDelay: `${getDelay()}ms`,
          }}
        >
          <h3>开发工具</h3>
          <ul>
            <li>
              <>
                <IconLogoWebstormDark className="mx-1 translate-y-0.5 dark:hidden" />
                <IconLogoWebstormLight className="mx-1 hidden translate-y-0.5 dark:inline-block" />
              </>
              WebStorm +
              <>
                <IconLogoVscodeDark className="mx-1 translate-y-0.5 dark:hidden" />
                <IconLogoVscodeLight className="mx-1 hidden translate-y-0.5 dark:inline-block" />
              </>
              VSCode
            </li>
            <li>
              <>
                <IconLogoZshDark className="mx-1 inline-block translate-y-0.5 dark:hidden" />
                <IconLogoZshLight className="mx-1 hidden translate-y-0.5 dark:inline-block" />
              </>
              Zsh + Oh My Zsh + Warp + Termius
            </li>
            <li>
              主要使用
              <>
                <IconSkillUbuntuDark
                  className="mx-1
                  translate-y-0.5 dark:hidden"
                />
                <IconSkillUbuntuLight className="mx-1 hidden translate-y-0.5 dark:inline-block" />
              </>
              Ubuntu、 使用过
              <>
                <IconSkillDebianDark className="mx-1 translate-y-0.5 dark:hidden" />
                <IconSkillDebianLight className="mx-1 hidden translate-y-0.5 dark:inline-block" />
              </>
              Debian
            </li>
            <li>
              <IconSkillDocker className="mx-1 translate-y-0.5" />
              Docker + 1Panel
            </li>
            <li>
              使用
              <IconSkillNginx className="mx-1 translate-y-0.5" />
              NGINX + OpenResty 反向代理 + 配置 HTTPS
            </li>
            <li>
              <>
                <IconSkillFigmaDark className="mx-1 translate-y-0.5 dark:hidden" />
                <IconSkillFigmaLight className="mx-1 hidden translate-y-0.5 dark:inline-block" />
              </>
              Figma 简单操作
            </li>
            <li>
              熟练使用 <IconLogoGoogle className="mx-1 translate-y-0.5" />
              Google +
              <IconBrandGithub className="mx-1 translate-y-0.5" />
              GitHub +
              <>
                <IconSkillStackoverflowDark className="mx-1 translate-y-0.5 dark:hidden" />
                <IconSkillStackoverflowLight className="mx-1 hidden translate-y-0.5 dark:inline-block" />
              </>
              Stack Overflow + Chat GPT 解决遇到的各种问题
            </li>
          </ul>
        </div>

        <div
          className="animate-fade-up animate-ease-in-out"
          style={{
            animationDelay: `${getDelay()}ms`,
          }}
        >
          <h2>我的设备</h2>
          <ul>
            <li>MacBook Pro 16-inch M2 Pro + 32G + 1TB + macOS</li>
            <li>
              ThinkPad X1 Carbon Gen 5 + i7-7600U + 16G + 512G + Ubuntu 24.04 +
              Gnome
            </li>
            <li>i5-12400F + 32G DDR5 + 4TB + RTX4060Ti</li>
            <li>DELL 27英寸 4K</li>
            <li>键盘：OWLab Spring</li>
            <li>鼠标：Logitech MX Master 3S</li>
          </ul>
        </div>

        <div
          className="animate-fade-up animate-ease-in-out"
          style={{
            animationDelay: `${getDelay()}ms`,
          }}
        >
          <h2>联系我</h2>
          <p>你可以通过👇下面任意一种方式联系我</p>
          <ul className="!mb-0 flex !list-none items-center space-x-4 !pl-0">
            {socialMediaList.map((el) => (
              <li key={el.link}>
                <Button asChild variant="outline" size="icon">
                  <Link href={el.link} target="_blank">
                    {el.icon}
                  </Link>
                </Button>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
}
