# Шаблоны

## plantuml

Текст перед диаграммой @startuml
Alice -> Bob: Authentication Request
Bob --> Alice: Authentication Response
Alice -> Bob: Another authentication Request
Alice <-- Bob: another authentication Response
@enduml текст после диаграммы

@startuml
Alice -> Bob: Authentication Request
Bob --> Alice: Authentication Response
Alice -> Bob: Another authentication Request
Alice <-- Bob: another authentication Response
@enduml

Предложение после диаграммы

## graphviz

Текст перед диаграммой %%(graphviz)
digraph {
    subgraph cluster_Shell1 {
      subgraph cluster_Shell2 {
        subgraph cluster_Shell3 {
            A -> C [label="index"]
        }
      }
    }
    B->C
}
%% текст после диаграммы

%%(graphviz neato)
digraph Some {
    SomeVeryLongName1 [shape=rect, fontsize=6]
    SomeVeryLongName2 [shape=rect, fontsize=10]
    SomeVeryLongName3 [shape=rect, fontsize=20]
    SomeVeryLongName1 -> SomeVeryLongName2 -> SomeVeryLongName3
}
%%

Предложение после диаграммы

## LaTeX

Формула $\sqrt{3x-1}+(1+x)^2$ внутри строки

Формула на несколько $$\begin{array}{c}

\nabla \times \vec{\mathbf{B}} -\, \frac1c\, \frac{\partial\vec{\mathbf{E}}}{\partial t} &
= \frac{4\pi}{c}\vec{\mathbf{j}}    \nabla \cdot \vec{\mathbf{E}} & = 4 \pi \rho \\

\nabla \times \vec{\mathbf{E}}\, +\, \frac1c\, \frac{\partial\vec{\mathbf{B}}}{\partial t} & = \vec{\mathbf{0}} \\

\nabla \cdot \vec{\mathbf{B}} & = 0

\end{array}$$ строк. $$\begin{array}{c}

\nabla \times \vec{\mathbf{B}} -\, \frac1c\, \frac{\partial\vec{\mathbf{E}}}{\partial t} &
= \frac{4\pi}{c}\vec{\mathbf{j}}    \nabla \cdot \vec{\mathbf{E}} & = 4 \pi \rho \\

\nabla \times \vec{\mathbf{E}}\, +\, \frac1c\, \frac{\partial\vec{\mathbf{B}}}{\partial t} & = \vec{\mathbf{0}} \\

\nabla \cdot \vec{\mathbf{B}} & = 0

\end{array}$$ текст после формулы

Это бабосики $20,000, а не формула

## Условные операторы

Какой-то текст {% if region == "ru" %}

При тарификации вычислительных ресурсов учитывается количество ядер (vCPU), объем памяти, выделенный для приложения, и время выполнения приложения:
* Количество ядер, указанное при создании ревизии, измеряется в vCPU и является положительным вещественным числом.
* Объем памяти, указанный при создании ревизии, измеряется в ГБ.
* Суммарное время работы контейнера измеряется в часах, и округляется в большую сторону до ближайшего значения, кратного 100 мс.

{% endif %}

{% if region == "ru" %} какой-то текст

При тарификации вычислительных ресурсов учитывается количество ядер (vCPU), объем памяти, выделенный для приложения, и время выполнения приложения:
* Количество ядер, указанное при создании ревизии, измеряется в vCPU и является положительным вещественным числом.
* Объем памяти, указанный при создании ревизии, измеряется в ГБ.
* Суммарное время работы контейнера измеряется в часах, и округляется в большую сторону до ближайшего значения, кратного 100 мс.

{% endif %}

{% if region == "ru" %}

При тарификации вычислительных ресурсов учитывается количество ядер (vCPU), объем памяти, выделенный для приложения, и время выполнения приложения:
* Количество ядер, указанное при создании ревизии, измеряется в vCPU и является положительным вещественным числом.
* Объем памяти, указанный при создании ревизии, измеряется в ГБ.
* Суммарное время работы контейнера измеряется в часах, и округляется в большую сторону до ближайшего значения, кратного 100 мс.

{% endif %}

Какой-то текст {% if  OS == 'iOS' %} Apple {% else %} Android {% endif %} продолжение текста.

## Вставка кода из файла {#create-vm}

{% code './_includes/main.cpp' lang='cpp' lines='[BEGIN create producer]-[END create producer]' %}

## Переиспользование контента {#connect-rdp}

{% include [vm-connect-rdp](../../_includes/vm-connect-rdp.md) %}

## Циклы

Предложение перед циклом

{% for user in users %}

Текст внутри цикла {{user}}

{% endfor %}

Предложение после цикла

Текст перед циклом {% for user in users %} Текст внутри цикла {{user}} {% endfor %} Текст после цикла

## Фильтры

Привет {{ user.name | capitalize }}!

{{ users | length }}

## Функции

Привет {{ user.name.slice(1) }}!

## Переменные

Создайте [виртуальную машину](../concepts/vm.md) Windows с помощью сервиса {{ compute-short-name }} в консоли управления {{ yandex-cloud }} и подключитесь к ней.
