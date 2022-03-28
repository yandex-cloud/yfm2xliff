# %%%1%%%

## %%%2%%%

%%%3%%% @startuml
Alice -> Bob: Authentication Request
Bob --> Alice: Authentication Response
Alice -> Bob: Another authentication Request
Alice <-- Bob: another authentication Response
@enduml %%%4%%%

@startuml
Alice -> Bob: Authentication Request
Bob --> Alice: Authentication Response
Alice -> Bob: Another authentication Request
Alice <-- Bob: another authentication Response
@enduml

%%%5%%%

## %%%6%%%

%%%7%%% %%(graphviz)
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
%% %%%8%%%

%%(graphviz neato)
digraph Some {
    SomeVeryLongName1 [shape=rect, fontsize=6]
    SomeVeryLongName2 [shape=rect, fontsize=10]
    SomeVeryLongName3 [shape=rect, fontsize=20]
    SomeVeryLongName1 -> SomeVeryLongName2 -> SomeVeryLongName3
}
%%

%%%9%%%

## %%%10%%%

%%%11%%% $\sqrt{3x-1}+(1+x)^2$ %%%12%%%

%%%13%%% $$\begin{array}{c}

\nabla \times \vec{\mathbf{B}} -\, \frac1c\, \frac{\partial\vec{\mathbf{E}}}{\partial t} &
= \frac{4\pi}{c}\vec{\mathbf{j}}    \nabla \cdot \vec{\mathbf{E}} & = 4 \pi \rho \\

\nabla \times \vec{\mathbf{E}}\, +\, \frac1c\, \frac{\partial\vec{\mathbf{B}}}{\partial t} & = \vec{\mathbf{0}} \\

\nabla \cdot \vec{\mathbf{B}} & = 0

\end{array}$$ %%%14%%% $$\begin{array}{c}

\nabla \times \vec{\mathbf{B}} -\, \frac1c\, \frac{\partial\vec{\mathbf{E}}}{\partial t} &
= \frac{4\pi}{c}\vec{\mathbf{j}}    \nabla \cdot \vec{\mathbf{E}} & = 4 \pi \rho \\

\nabla \times \vec{\mathbf{E}}\, +\, \frac1c\, \frac{\partial\vec{\mathbf{B}}}{\partial t} & = \vec{\mathbf{0}} \\

\nabla \cdot \vec{\mathbf{B}} & = 0

\end{array}$$ %%%15%%%

%%%16%%%

## %%%17%%%

%%%18%%% {% if region == "ru" %}

%%%19%%%
* %%%20%%%
* %%%21%%%
* %%%22%%%

{% endif %}

{% if region == "ru" %} %%%23%%%

%%%24%%%
* %%%25%%%
* %%%26%%%
* %%%27%%%

{% endif %}

{% if region == "ru" %}

%%%28%%%
* %%%29%%%
* %%%30%%%
* %%%31%%%

{% endif %}

%%%32%%% {% if  OS == 'iOS' %} %%%33%%% {% else %} %%%34%%% {% endif %} %%%35%%%

## %%%36%%% {#create-vm}

{% code './_includes/main.cpp' lang='cpp' lines='[BEGIN create producer]-[END create producer]' %}

## %%%37%%% {#connect-rdp}

{% include [vm-connect-rdp](../../_includes/vm-connect-rdp.md) %}

## %%%38%%%

%%%39%%%

{% for user in users %}

%%%40%%%

{% endfor %}

%%%41%%%

%%%42%%% {% for user in users %} %%%43%%% {% endfor %} %%%44%%%

## %%%45%%%

%%%46%%%

%%%47%%%

## %%%48%%%

%%%49%%%

## %%%50%%%

%%%51%%% [%%%52%%%](../concepts/vm.md) %%%53%%%
